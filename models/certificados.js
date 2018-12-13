var Request = require("request");


module.exports = {
    login: function(req, res){
        var login = {
            "username" : req.body.username,
            "password" : req.body.password
        }

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://rest-api-revata-jrevata.c9users.io/api/Users/login",
            "body": JSON.stringify(login)
        }, (error, response, body) => {
            if(error) {
                
                return console.dir(error);
            }

            if(response.statusCode==200){
                var login2 = JSON.parse(body);
               
                Request.get("https://rest-api-revata-jrevata.c9users.io/api/Participantes/"+login2.userId, (error, response, body) => {
                    if(error) {
                        return console.dir(error);
                    }
                    participante = JSON.parse(body)
                    console.dir(participante);
                    
                    Request.get("https://rest-api-revata-jrevata.c9users.io/api/Companhia/"+participante.idCompanhia, (error, response, body) => {
                        if(error) {
                            return console.dir(error); 
                        }
                        compañia = JSON.parse(body);
                        console.dir(compañia);
                        datos = {
                            idparticipantes : participante.idparticipantes,
                            nombres         :  participante.nombre + " " + participante.apellido,
                            dni             : participante.dni,
                            nombre          : compañia.nombre,
                            fechaCreacion   : compañia.fechaCreacion
                        }
                        res.redirect('home/'+participante.idparticipantes);
                    });


                });

                
                
                console.dir(login2);
               
                 
            }else{
                var error = "Usuario o contraseña incorrectos";
                res.render('login', {data:error});
            }
        });

    },
    home : function(req, res){
        Request.get("https://rest-api-revata-jrevata.c9users.io/api/Participantes/"+req.params.id , (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            participante = JSON.parse(body)
            console.dir(participante);
            
            Request.get("https://rest-api-revata-jrevata.c9users.io/api/Companhia/"+participante.idCompanhia, (error, response, body) => {
                if(error) {
                    return console.dir(error); 
                }
                compañia = JSON.parse(body);
                console.dir(compañia);
                let datos = {
                    idparticipantes : participante.idparticipantes,
                    nombres         :  participante.nombre + " " + participante.apellido,
                    dni             : participante.dni,
                    nombre          : compañia.nombre,
                    fechaCreacion   : compañia.fechaCreacion
                }
                res.render('home' , {datos : datos});
            });


        });
    },
    list : function(req, res){
        Request.get("https://rest-api-revata-jrevata.c9users.io/api/Certificados", (error, response, body) => {
            if(error) {
                return console.dir(error); 
            }
            var certificados = JSON.parse(body);
            var id = req.params.id;
            var trueCertificados = [];
            for(let i = 0; i < certificados.length;i++){
                if(certificados[i].idPrimerParticipante == id){
                    trueCertificados.push(certificados[i])
                }
            }
            console.log(trueCertificados);
            res.render('certificado_list', {datos : trueCertificados, certificados : certificados});
        });
    },
    show : function(req, res){
        Request.get("https://rest-api-revata-jrevata.c9users.io/api/Certificados/"+req.params.id, (error, response, body) =>{
            if(error){
                return console.dir(error);
            }
            certificado = JSON.parse(body);
            res.render('detail_certificado' , {datos : certificado});
        });
    },
    newForm : function(req, res){
        Request.get("https://rest-api-revata-jrevata.c9users.io/api/Participantes/"+req.params.id, (error, response, body) =>{
            if(error){
                return console.dir(error);
            }
            participante = JSON.parse(body);
            var newId = parseInt(req.params.idCert)+1;
            res.render('new_certificado' , {datos : participante, idCert :newId });
        });
    },
    create : function(req, res){
        var newCertificado = {
            idcertificados      : req.body.idcertificados,
            verificacion        : 0,
            nombreRepresentante : req.body.nombreRepresentante,
            cargoRepresentante  : req.body.cargoRepresentante,
            dniRepresentante    : req.body.dniRepresentante,
            telRepresentante    : req.body.telRepresentante,
            emailRepresentante  : req.body.emailRepresentante,
            departamento        : req.body.departamento,
            provincia           : req.body.provincia,
            distrito            : req.body.distrito,
            motivo              : req.body.motivo,
            idPrimerParticipante: req.body.idPrimerParticipante,
            idPropietario       : req.body.idPropietario,
            idCompanhia         : req.body.idCompanhia
        }

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://rest-api-revata-jrevata.c9users.io/api/Certificados",
            "body": JSON.stringify(newCertificado)
        }, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
            res.redirect('/getCertificados/'+newCertificado.idPropietario);
        });
    }
}
