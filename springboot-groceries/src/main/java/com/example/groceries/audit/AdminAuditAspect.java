package com.example.groceries.audit;

import com.example.groceries.security.UserPrincipal;
import com.example.groceries.service.AuditLogService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import org.springframework.expression.Expression;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

import java.lang.reflect.Method;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminAuditAspect {

    private final EntityManager entityManager;
    private final AuditLogService auditLogService;

    private final SpelExpressionParser spel = new SpelExpressionParser();
    private final AuditJson auditJson = new AuditJson();

    @Around("@annotation(com.example.groceries.audit.AdminAuditMutation)")
    public Object auditMutation(ProceedingJoinPoint pjp) throws Throwable {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAdmin(auth)) {
            return pjp.proceed();
        }

        MethodSignature sig = (MethodSignature) pjp.getSignature();
        Method method = sig.getMethod();
        AdminAuditMutation ann = method.getAnnotation(AdminAuditMutation.class);

        Object[] args = pjp.getArgs();

        Object idBefore = evalSpel(ann.entityIdBefore(), sig.getParameterNames(), args, null);
        String beforeJson = null;
        if (ann.operation() != AdminAuditMutation.Operation.CREATE) {
            Object beforeEntity = findEntity(ann.entityClass(), idBefore);
            beforeJson = auditJson.toJson(beforeEntity);
        }

        Object result = pjp.proceed();

        Object idAfter = evalSpel(ann.entityIdAfter(), sig.getParameterNames(), args, result);
        if (idAfter == null) {
            // Fall back to before id if not provided.
            idAfter = idBefore;
        }

        String afterJson = null;
        if (ann.operation() != AdminAuditMutation.Operation.DELETE) {
            Object afterEntity = findEntity(ann.entityClass(), idAfter);
            afterJson = auditJson.toJson(afterEntity);
        }

        String actorUsername = auth != null ? auth.getName() : null;
        Long actorUserId = actorUserId(auth);

        try {
            auditLogService.record(
                    actorUsername,
                    actorUserId,
                    ann.entity(),
                    idAfter != null ? String.valueOf(idAfter) : "",
                    beforeJson,
                    afterJson
            );
        } catch (Exception e) {
            // Never break the mutation path because of auditing.
            log.warn("Failed to persist audit log for {} {}", ann.entity(), idAfter, e);
        }

        return result;
    }

    private Object evalSpel(String expr, String[] paramNames, Object[] args, Object result) {
        if (expr == null || expr.isBlank()) {
            return null;
        }
        try {
            StandardEvaluationContext ctx = new StandardEvaluationContext();
            if (paramNames != null) {
                for (int i = 0; i < paramNames.length && i < args.length; i++) {
                    ctx.setVariable(paramNames[i], args[i]);
                }
            }
            ctx.setVariable("result", result);
            Expression ex = spel.parseExpression(expr);
            return ex.getValue(ctx);
        } catch (Exception ignored) {
            return null;
        }
    }

    private Object findEntity(Class<?> entityClass, Object id) {
        if (entityClass == null || id == null) {
            return null;
        }
        try {
            return entityManager.find(entityClass, id);
        } catch (Exception ignored) {
            return null;
        }
    }

    private static boolean isAdmin(Authentication auth) {
        if (auth == null || auth.getAuthorities() == null) {
            return false;
        }
        for (GrantedAuthority a : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(a.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    private static Long actorUserId(Authentication auth) {
        if (auth == null) {
            return null;
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof UserPrincipal up) {
            return up.getId();
        }
        return null;
    }
}
