var Request = require("request");

module.exports = {

    getAll : function(req, res){
        Request.get("https://rest-api-revata-jrevata.c9users.io/api/Transaccions", (error, response, body) => {
            if(error) {
                return console.dir(error); 
            }
            transacciones = JSON.parse(body);
            var truetransaccion = [];
            var id = req.params.id;
            for(let i = 0; i < transacciones.length;i++){
                if(transacciones[i].idParticipante == id){
                    truetransaccion.push(transacciones[i])
                }
            }

            res.render('transaccion_list', {datos : truetransaccion, id : id});
        });

        
    },
    prepareTransaccion : function(req, res){
        Request.get("https://rest-api-revata-jrevata.c9users.io/api/Certificados", (error, response, body) => {
            if(error) {
                return console.dir(error); 
            }
            var certificados = JSON.parse(body);
            var id = req.params.id;
            var trueCertificados = [];
            for(let i = 0; i < certificados.length;i++){
                if(certificados[i].idPropietario == id){
                    trueCertificados.push(certificados[i])
                }
            }
            console.log(trueCertificados);
            res.render('transaccion_action', {datos : trueCertificados, id : id});
        });
    },
    generateTransaccion : function(req, res){
        Request.get("https://rest-api-revata-jrevata.c9users.io/api/Transaccions", (error, response, body) => {
            if(error) {
                return console.dir(error); 
            }
            transacciones = JSON.parse(body);
            var idNew = 0;
            if(transacciones[0].idtransacciones==null){
                idNew = 1
            }else{
                idNew = transacciones[transacciones.length-1].idtransacciones + 1;
            }
           
            var newTransaccion = {
                idtransacciones : idNew,
                fechaTransaccion : '13-12-2018',
                idParticipante   : req.body.idParticipante,
                idCertificado    : req.body.idCertificado

            };

            Request.post({
                "headers": { "content-type": "application/json" },
                "url": "https://rest-api-revata-jrevata.c9users.io/api/Transaccions",
                "body": JSON.stringify(newTransaccion)
            }, (error, response, body) => {
                if(error) {
                    return console.dir(error);
                }
                console.dir(JSON.parse(body));
               
            });

            Request.get("https://rest-api-revata-jrevata.c9users.io/api/Certificados/"+req.body.idCertificado, (error, response, body) =>{
                if(error){
                    return console.dir(error);
                }
                var certificado = JSON.parse(body);
                certificado.idPropietario = 1;

                
                Request.put({
                    "headers": { "content-type": "application/json" },
                    "url": "https://rest-api-revata-jrevata.c9users.io/api/Certificados/"+req.body.idCertificado,
                    "body": JSON.stringify(certificado)
                }, (error, response, body) => {
                    if(error) {
                        return console.dir(error);
                    }
                    console.dir(JSON.parse(body));
                    res.redirect('/transacciones/'+req.body.idParticipante);
                });
            });



        });
    }

}

function hoyFecha(){
    var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth()+1;
        var yyyy = hoy.getFullYear();
        
        dd = addZero(dd);
        mm = addZero(mm);
 
        return dd+'-'+mm+'-'+yyyy;
}