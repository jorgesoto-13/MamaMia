package com.pizzeria.mamamia.repository;

import com.pizzeria.mamamia.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}