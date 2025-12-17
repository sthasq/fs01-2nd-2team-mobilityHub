package com.iot2ndproject.mobilityhub.domain.service_request.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(
        name = "parking_map_edge",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_parking_map_edge_from_to_dir",
                        columnNames = {"from_node_id", "to_node_id", "direction"}
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingMapEdgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "edge_id")
    private int edgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_node_id", nullable = false)
    @ToString.Exclude
    private ParkingMapNodeEntity fromNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_node_id", nullable = false)
    @ToString.Exclude
    private ParkingMapNodeEntity toNode;

    @Column(name = "direction", nullable = false)
    private String direction;
}
