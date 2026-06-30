package com.pizzeria.mamamia.controller;

import com.pizzeria.mamamia.model.Pedido;
import com.pizzeria.mamamia.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Esta puerta recibe el pago del carrito (Ya la tenían)
    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    // --- NUEVA PUERTA: Permitirá al Administrador ver todas las ventas ---
    @GetMapping
    public List<Pedido> obtenerTodosLosPedidos() {
        return pedidoRepository.findAll();
    }
}