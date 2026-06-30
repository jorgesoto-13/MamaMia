package com.pizzeria.mamamia.controller;

import com.pizzeria.mamamia.model.Pedido;
import com.pizzeria.mamamia.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

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

    @GetMapping("/numero/{numPedido}")
    public ResponseEntity<Pedido> obtenerPorNumero(@PathVariable String numPedido) {
        Optional<Pedido> pedido = pedidoRepository.findByNumPedido(numPedido);
        if (pedido.isPresent()) {
            return ResponseEntity.ok(pedido.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Long id, @RequestBody Pedido pedidoActualizado) {
        Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);
        if (pedidoOpt.isPresent()) {
            Pedido pedido = pedidoOpt.get();
            pedido.setEstado(pedidoActualizado.getEstado()); // Actualizamos solo el estado
            return ResponseEntity.ok(pedidoRepository.save(pedido)); // Guardamos en MySQL
        }
        return ResponseEntity.notFound().build();
    }

}