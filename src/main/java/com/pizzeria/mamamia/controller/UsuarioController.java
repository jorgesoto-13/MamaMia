package com.pizzeria.mamamia.controller;

import com.pizzeria.mamamia.model.Usuario;
import com.pizzeria.mamamia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario loginData) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreoAndPassword(loginData.getCorreo(),
                loginData.getPassword());
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    // --- ¡NUEVO: ESTO ES LO QUE FALTABA PARA REGISTRAR! ---
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario nuevoUsuario) {
        // Le asignamos el rol por defecto si no lo tiene
        if (nuevoUsuario.getRol() == null) {
            nuevoUsuario.setRol("CLIENTE");
        }
        // Guardamos el usuario real en la base de datos de Railway
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok(usuarioGuardado);
    }

    // --- ESTA ES LA PUERTA PARA VER DATOS EN LA URL ---
    @GetMapping
    public ResponseEntity<java.util.List<Usuario>> verTodosLosUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }
}