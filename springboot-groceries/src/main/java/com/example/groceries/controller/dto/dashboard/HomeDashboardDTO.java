package com.example.groceries.controller.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.example.groceries.controller.dto.dashboard.BuyAgainDTO;
import com.example.groceries.controller.dto.dashboard.LowStockDTO;
import com.example.groceries.controller.dto.dashboard.MonthlyStockDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HomeDashboardDTO {
    private List<MonthlyStockDTO> monthlyStock;
    private List<BuyAgainDTO> buyAgain;
    private List<LowStockDTO> lowStock;
}
