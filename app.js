var express       = require("express"),
  app             = express(),
  bodyParser      = require("body-parser"),
  methodOverride  = require("method-override"),
  dotenv          = require('dotenv');

dotenv.load();

var sendgrid_apikey = process.env.SENDGRID_APIKEY;
var to              = process.env.TO;
var to_name         = process.env.TO_NAME;

var sendgrid  = require('sendgrid')(sendgrid_apikey);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.post('/send-email', function(req, res) {
  var email_params = {
    to:       to,
    toname:   to_name,
    from:     req.body.email,
    fromname: req.body.name,
    subject:  'Solicitud de cotización',
    html:     "<h1>Nueva cotización</h1><br />%name% ha solicitado una cotización de %product%<p>El teléfono indicado es %phone%.</p><p>Mensaje: <br />%message%</p>",
    replyto:  req.body.email
  }
  
  var email = new sendgrid.Email(email_params);
  
  email.addSubstitution('%name%', req.body.name);
  email.addSubstitution('%product%', req.body.product);
  email.addSubstitution('%phone%', req.body.phone);
  email.addSubstitution('%message%', req.body.message);
  
  sendgrid.send(email, function(err, json) {
    if(err) {
      console.log(err);
      res.send(false);
    }else{
      console.log(json);
      res.send(true);
    }
    
  });
  
});

app.use(router);

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});
