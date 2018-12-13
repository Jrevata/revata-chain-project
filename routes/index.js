var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var noticias = require('../models/noticias');
var certificados = require('../models/certificados');
var transacciones = require('../models/transacciones');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login' , function(req,res){
  res.render('login');
}) 

router.post('/login', certificados.login);

router.get('/getCertificados/:id' , certificados.list);

router.get('/detailCertificado/:id' , certificados.show);

router.get('/newCertificado/:id&:idCert' , certificados.newForm);

router.post('/crear_certificado', certificados.create);

router.get('/newCertificado' , function(req,res){
  res.render('new_certificado');
})

router.get('/home/:id', certificados.home);

router.get('/news_listar' , noticias.listAll);
router.post('/news_crear', noticias.createNotice);
router.post('/news_update/:id' , noticias.updateNotice);
router.get('/news_remove/:id' , noticias.deleteNotice);

router.get('/news_detail/:action/:id', noticias.detailNotice);
router.post('/comment_create/:id', noticias.createComment);

router.get('/transacciones/:id', transacciones.getAll);
router.get('/transaccionesAction/:id', transacciones.prepareTransaccion);
router.post('/transaccion', transacciones.generateTransaccion);



//vistas
router.get('/noticias', function(req,res){
  res.render('noticias');
});
router.get('/new_noticia', function(req,res){
  res.render('form_notice');
});

module.exports = router;
