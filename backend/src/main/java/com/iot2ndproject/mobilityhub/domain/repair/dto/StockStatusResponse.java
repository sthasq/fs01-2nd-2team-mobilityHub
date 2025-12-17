package com.iot2ndproject.mobilityhub.domain.repair.dto;

import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockStatusResponse {
    private String inventoryId;
    private String productName;
    private String stockCategory;
    private String stockUnits;
    private int stockQuantity;
    private int minStockQuantity;
    private LocalDateTime updateTime;
    private String sectorId;
    private int stockPrice;

    public StockStatusResponse(StockStatusEntity entity) {
        this.inventoryId = entity.getInventoryId();
        this.productName = entity.getProductName();
        this.stockCategory = entity.getStockCategory();
        this.stockUnits = entity.getStockUnits();
        this.stockQuantity = entity.getStockQuantity();
        this.minStockQuantity = entity.getMinStockQuantity();
        this.updateTime = entity.getUpdateTime();
        this.stockPrice = entity.getStockPrice();

        // 연관 엔티티 → 값만 추출
        if (entity.getSectorId() != null) {
            this.sectorId = entity.getSectorId().getSectorId();
        }
    }
}
