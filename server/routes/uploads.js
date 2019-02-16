const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }
    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son: ' + tiposValidos.join(', '),
                tipo
            }
        });
    }

    let imagen = req.files.archivo;


    // Extensiones permitidas
    let extens = ['png', 'jpg', 'jpeg', 'gif'];
    let nombreExtens = imagen.name.split('.');

    let ext = nombreExtens[nombreExtens.length - 1]

    if (extens.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extens.join(', '),
                extension: ext
            }
        });
    }

    // cambiar nombre al archivo
    let nombreImagen = `${ id }-${ new Date().getMilliseconds() }.${ ext }`;

    imagen.mv(`uploads/${ tipo }/${ nombreImagen }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'productos') {
            imagenProducto(id, res, nombreImagen);
        } else if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreImagen);
        }
    });
});

function imagenUsuario(id, res, nombreImagen) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreImagen, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreImagen, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreImagen;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreImagen
            });
        });

    });
}

function imagenProducto(id, res, nombreImagen) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreImagen, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreImagen, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreImagen;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreImagen
            });
        });

    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;