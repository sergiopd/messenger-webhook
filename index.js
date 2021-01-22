"use strict";
// Importa dependencias y configura el servidor http
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express().use(bodyParser.json()); // crea un servidor http express

// Ajusta el puerto del servidor y mensajes de logs en el éxito
app.listen(process.env.PORT || 1557, () => console.log("webhook is listening"));

// Crea el punto final para nuestro webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  // Comprueba que este es un evento de una suscripción a una página.
  if (body.object === "page") {
    // Itera sobre cada entrada - pueden ser múltiples si es batcheada
    body.entry.forEach(function (entry) {
      // Obtiene el mensaje. entry.messaging es un arreglo, pero
      // contendrá siempre un mensaje, por lo tanto obtenemos index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Regresa una respuesta '200 OK' a todas las solicitudes
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // REgresa un '404 Not Found' si el evento no es de una suscripción de página
    res.sendStatus(404);
  }
});

// Agrega soporte para solicitudes GET a nuestro webhook
app.get("/webhook", (req, res) => {
  // Tu token de verificación. Debe de ser una cadena aleatoria.
  let VERIFY_TOKEN = "9Tq%Garmisch2006";

  // Parse los parámetros de la consulta
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Comprueba si el token y el modo está en la cadena de consulta de la solicitud
  if (mode && token) {
    // Comprueba el modo y el token enviado es correcto
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responde con el token de desafío desde la solicitud
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responde con '403 Forbidden' si el tokens verificado no concuerda
      res.sendStatus(403);
    }
  }
});
