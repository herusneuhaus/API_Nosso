// BACKEND DA API
// BIBLIOTECAS UTILIZADAS PARA COMPOSIÇÃO DA API
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const express = require("express");
const { body, validationResult } = require("express-validator");
const socketIO = require("socket.io");
const qrcode = require("qrcode");
const http = require("http");
const fileUpload = require("express-fileupload");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// PORTA ONDE O SERVIÇO SERÁ INICIADO
const port = 8001;
const idClient = "bot-nosso";

// SERVIÇO EXPRESS
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    debug: true,
  })
);
app.use("/", express.static(__dirname + "/"));

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

// PARÂMETROS DO CLIENT DO WPP
const client = new Client({
  authStrategy: new LocalAuth({ clientId: idClient }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    // CAMINHO DO CHROME PARA WINDOWS (REMOVER O COMENTÁRIO ABAIXO)
    // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

    //===================================================================================
    // CAMINHO DO CHROME PARA MAC (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //===================================================================================
    // CAMINHO DO CHROME PARA LINUX (REMOVER O COMENTÁRIO ABAIXO)
    //executablePath: '/usr/bin/google-chrome-stable',
    //===================================================================================
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
});

// INITIALIZE DO CLIENT DO WPP
client.initialize();

// EVENTOS DE CONEXÃO EXPORTADOS PARA O INDEX.HTML VIA SOCKET
io.on("connection", function (socket) {
  socket.emit("message", "© BOT-NOSSO - Iniciado");
  socket.emit("qr", "./icon.svg");

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit(
        "message",
        "© BOT-NOSSO QRCode recebido, aponte a câmera  seu celular!"
      );
    });
  });

  client.on("ready", () => {
    socket.emit("ready", "© BOT-NOSSO Dispositivo pronto!");
    socket.emit("message", "© BOT-NOSSO Dispositivo pronto!");
    socket.emit("qr", "./check.svg");
    console.log("© BOT-NOSSO Dispositivo pronto");
  });

  client.on("authenticated", () => {
    socket.emit("authenticated", "© BOT-NOSSO Autenticado!");
    socket.emit("message", "© BOT-NOSSO Autenticado!");
    console.log("© BOT-NOSSO Autenticado");
  });

  client.on("auth_failure", function () {
    socket.emit("message", "© BOT-NOSSO Falha na autenticação, reiniciando...");
    console.error("© BOT-NOSSO Falha na autenticação");
  });

  client.on("change_state", (state) => {
    console.log("© BOT-NOSSO Status de conexão: ", state);
  });

  client.on("disconnected", (reason) => {
    socket.emit("message", "© BOT-NOSSO Cliente desconectado!");
    console.log("© BOT-NOSSO Cliente desconectado", reason);
    client.initialize();
  });
});

// POST PARA ENVIO DE MENSAGEM
app.post(
  "/send-message",
  [body("number").notEmpty(), body("message").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
      return msg;
    });

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.mapped(),
      });
    }

    const number = req.body.number.replace(/\D/g, "");
    const message = req.body.message;
    const numberDDI = number.substring(0, 2);
    const numberDDD = number.substring(2, 4);
    const numberUser = number.substring(number.length - 8);
    const numberSerie = numberUser.slice(0, 1);

    if (numberDDI !== "55") {
      const numberZDG = number + "@c.us";
      client
        .sendMessage(numberZDG, message)
        .then((response) => {
          res.status(200).json({
            status: true,
            message: "BOT-NOSSO Mensagem enviada",
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "BOT-NOSSO Mensagem não enviada",
            response: err.text,
          });
        });
    } else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
      if (numberSerie >= 6) {
        const numberZDG = "55" + numberDDD + "9" + numberUser + "@c.us";
        client
          .sendMessage(numberZDG, message)
          .then((response) => {
            res.status(200).json({
              status: true,
              message: "BOT-NOSSO Mensagem enviada",
              response: response,
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: false,
              message: "BOT-NOSSO Mensagem não enviada",
              response: err.text,
            });
          });
        console.log("BOT-NOSSO - Série Celular");
      }
      if (numberSerie < 6) {
        const numberZDGVal = "55" + numberDDD + "9" + numberUser + "@c.us";
        client.sendMessage(numberZDGVal, message);
        const numberZDG = "55" + numberDDD + numberUser + "@c.us";
        client
          .sendMessage(numberZDG, message)
          .then((response) => {
            res.status(200).json({
              status: true,
              message: "BOT-NOSSO Mensagem enviada",
              response: response,
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: false,
              message: "BOT-NOSSO Mensagem não enviada",
              response: err.text,
            });
          });
        console.log("BOT-NOSSO - Série Fixo");
      }
    } else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
      const numberZDG = "55" + numberDDD + numberUser + "@c.us";
      client
        .sendMessage(numberZDG, message)
        .then((response) => {
          res.status(200).json({
            status: true,
            message: "BOT-NOSSO Mensagem enviada",
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "BOT-NOSSO Mensagem não enviada",
            response: err.text,
          });
        });
    }
  }
);

// POST PARA ENVIO DE MIDIA VIA URL
app.post("/send-media", async (req, res) => {
  const number = req.body.number.replace(/\D/g, "");
  const caption = req.body.caption;
  const fileUrl = req.body.file;
  const numberDDI = number.substring(0, 2);
  const numberDDD = number.substring(2, 4);
  const numberUser = number.substring(number.length - 8);
  const numberSerie = numberUser.slice(0, 1);

  const media = await MessageMedia.fromUrl(fileUrl);

  if (numberDDI !== "55") {
    const numberZDG = number + "@c.us";
    client
      .sendMessage(numberZDG, media, { caption: caption })
      .then((response) => {
        res.status(200).json({
          status: true,
          message: "BOT-NOSSO Mensagem enviada",
          response: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "BOT-NOSSO Mensagem não enviada",
          response: err.text,
        });
      });
  } else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
    if (numberSerie >= 6) {
      const numberZDG = "55" + numberDDD + "9" + numberUser + "@c.us";
      client
        .sendMessage(numberZDG, media, { caption: caption })
        .then((response) => {
          res.status(200).json({
            status: true,
            message: "BOT-NOSSO Mensagem enviada",
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "BOT-NOSSO Mensagem não enviada",
            response: err.text,
          });
        });
      console.log("BOT-NOSSO - Série Celular");
    }
    if (numberSerie < 6) {
      const numberZDGVal = "55" + numberDDD + "9" + numberUser + "@c.us";
      client.sendMessage(numberZDGVal, media, { caption: caption });
      const numberZDG = "55" + numberDDD + numberUser + "@c.us";
      client
        .sendMessage(numberZDG, media, { caption: caption })
        .then((response) => {
          res.status(200).json({
            status: true,
            message: "BOT-NOSSO Mensagem enviada",
            response: response,
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "BOT-NOSSO Mensagem não enviada",
            response: err.text,
          });
        });
      console.log("BOT-NOSSO - Série Fixo");
    }
  } else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
    const numberZDG = "55" + numberDDD + numberUser + "@c.us";
    client
      .sendMessage(numberZDG, media, { caption: caption })
      .then((response) => {
        res.status(200).json({
          status: true,
          message: "BOT-NOSSO Mensagem enviada",
          response: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: "BOT-NOSSO Mensagem não enviada",
          response: err.text,
        });
      });
  }
});

// INITIALIZE DO SERVIÇO
server.listen(port, function () {
  console.log("© Comunidade NOSSO - Aplicativo rodando na porta *: " + port);
});
