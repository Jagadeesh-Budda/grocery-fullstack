package com.example.groceries.audit;

import jakarta.persistence.*;
import org.hibernate.proxy.HibernateProxy;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.time.temporal.Temporal;
import java.util.*;

class AuditSnapshotter {

    Map<String, Object> snapshot(Object entity) {
        if (entity == null) {
            return null;
        }

        Object unproxied = unproxy(entity);
        Class<?> clazz = unproxied.getClass();

        Map<String, Object> out = new LinkedHashMap<>();
        for (Field field : allFields(clazz)) {
            if (Modifier.isStatic(field.getModifiers())) {
                continue;
            }
            if (field.isAnnotationPresent(Transient.class)) {
                continue;
            }

            field.setAccessible(true);

            if (field.isAnnotationPresent(OneToMany.class) || field.isAnnotationPresent(ManyToMany.class)) {
                continue; // collections are too noisy + can force lazy loads
            }

            try {
                Object value = field.get(unproxied);

                if (field.isAnnotationPresent(ManyToOne.class) || field.isAnnotationPresent(OneToOne.class)) {
                    out.put(field.getName() + "Id", entityId(value));
                    continue;
                }

                if (value == null) {
                    out.put(field.getName(), null);
                    continue;
                }

                if (isSimpleValue(value)) {
                    out.put(field.getName(), value);
                    continue;
                }

                if (value instanceof Collection<?> || value instanceof Map<?, ?>) {
                    continue;
                }

                Object nestedId = entityId(value);
                if (nestedId != null) {
                    out.put(field.getName() + "Id", nestedId);
                    continue;
                }

                out.put(field.getName(), String.valueOf(value));
            } catch (IllegalAccessException ignored) {
                // If we can't read a field, skip it.
            }
        }

        return out;
    }

    private static boolean isSimpleValue(Object value) {
        return value instanceof String
                || value instanceof Number
                || value instanceof Boolean
                || value instanceof Enum<?>
                || value instanceof UUID
                || value instanceof Date
                || value instanceof Temporal;
    }

    private static Object unproxy(Object obj) {
        if (obj instanceof HibernateProxy proxy) {
            return proxy.getHibernateLazyInitializer().getImplementation();
        }
        return obj;
    }

    private static Object entityId(Object maybeEntity) {
        if (maybeEntity == null) {
            return null;
        }
        Object unproxied = unproxy(maybeEntity);
        try {
            // Convention in this codebase: entities use a field named "id".
            Field idField = findField(unproxied.getClass(), "id");
            if (idField == null) {
                return null;
            }
            idField.setAccessible(true);
            return idField.get(unproxied);
        } catch (IllegalAccessException ignored) {
            return null;
        }
    }

    private static List<Field> allFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        Class<?> current = clazz;
        while (current != null && current != Object.class) {
            fields.addAll(Arrays.asList(current.getDeclaredFields()));
            current = current.getSuperclass();
        }
        return fields;
    }

    private static Field findField(Class<?> clazz, String name) {
        Class<?> current = clazz;
        while (current != null && current != Object.class) {
            try {
                return current.getDeclaredField(name);
            } catch (NoSuchFieldException ignored) {
                current = current.getSuperclass();
            }
        }
        return null;
    }
}
