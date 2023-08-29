// BACKEND DA API
// BIBLIOTECAS UTILIZADAS PARA COMPOSIÇÃO DA API
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const express = require("express");
const { body, validationResult } = require("express-validator");
const qrcode = require("qrcode");
const http = require("http");
const fileUpload = require("express-fileupload");
const app = express();
const server = http.createServer(app);

// PORTA ONDE O SERVIÇO SERÁ INICIADO
const port = 8003;
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

//app.get("/", (req, res) => {
//  res.sendFile("index.html", {
//    root: __dirname,
//  });
//});

// PARÂMETROS DO CLIENT DO WPP
const client = new Client({
  authStrategy: new LocalAuth({ clientId: idClient }),
  puppeteer: {
    headless: true,
    // CAMINHO DO CHROME PARA WINDOWS (REMOVER O COMENTÁRIO ABAIXO)
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
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


app.get("/waitForQRCode", async (req, res) => {
  try {
    // Função para aguardar o evento "qrcode"
    const qrCodeValue = await new Promise((resolve) => {
      client.once("qr", (qrCodeValue) => {
        console.log("QR RECEIVED", qrCodeValue);
        resolve(qrCodeValue);
      });
    });

    // Função para gerar a imagem do QR Code em formato base64
    const generateQRCodeBase64 = async (qrCodeValue) => {
      return new Promise((resolve, reject) => {
        qrcode.toDataURL(qrCodeValue, (err, qrCodeBase64) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(qrCodeBase64);
        });
      });
    };

    // Gerar a imagem do QR Code em formato base64
    const qrCodeBase64 = await generateQRCodeBase64(qrCodeValue);

    // Enviar o conteúdo base64 como resposta
    res.send(qrCodeBase64);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao gerar o QR Code");
  }
});


 

app.listen(8000, () => {
  console.log("Server is running on port 8003");
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
  const fileUrl = req.body.fileUrl;
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
("");
