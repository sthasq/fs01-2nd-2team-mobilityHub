// 재고현황 테이블

package com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.stock.entity;

import com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.admin.entity.AdminEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import com.iot2ndproject.mobilityhub.mobility_hub_backend.domain.parking.entity.ParkingEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "StockStatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockStatusEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long InventoryId; // 재고 ID

    @Column(nullable = false)
    private String productName; // 제품이름

    @Column(nullable = false)
    private String stockCategory; // 카테고리

    @Column(nullable = false)
    private int stockQantity; // 수량

    @UpdateTimestamp
    private LocalDateTime updateTime; // 업데이트 날짜

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "adminId")
    private AdminEntity admin;

    // 재고 수량 변동시 <- 필요없으면 삭제 또는 변경
    public StockStatusEntity(String productName, int stockQantity){
        this.productName = productName;
        this.stockQantity = stockQantity;
        this.updateTime = LocalDateTime.now();
    }

    // 제품 등록시
    public StockStatusEntity(String productName, String stockCategory, int stockQantity) {
        this.productName = productName;
        this.stockCategory = stockCategory;
        this.stockQantity = stockQantity;
        this.updateTime = LocalDateTime.now();
    }

}
