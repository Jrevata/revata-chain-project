var mongoose = require('mongoose'),
Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/blog');

var comentario_schema = new Schema({
    autor   : String,
    mensaje : String,
    fecha   : String
},{ _id : false });

var noticia_schema = new Schema({
    _id          : Number,
    titulo       : String,
    descripcion  : String,
    categoria    : String,
    fecha        : String,
    comentarios  : [comentario_schema]
});

noticia_model = mongoose.model('noticias' , noticia_schema, 'noticias');

module.exports = {

    listAll: function(req, res){
        noticia_model.find({},function(err, items){
            if(!err){
                res.render('noticias' , {data:items});
            }else{
                return console.log(err);
            }
        });
    },

    detailNotice: function(req, res){
            noticia_model.findOne({_id: req.params.id}, function(err, noticia){
                if(!err){
                    if(req.params.action == 'show')
                        res.render('detail_notice', {data:noticia});
                    else if(req.params.action == 'update')
                        res.render('update_notice', {data:noticia});
                }else{
                    return console.log(err);
                }
            });
        
    },

    createNotice: function(req, res){
        noticia_model.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, noticia) {
            var  item = {
                _id : (noticia._id+1),
                titulo : req.body.titulo,
                descripcion : req.body.descripcion,
                categoria : req.body.categoria,
                fecha : getActualDate(),
                comentarios : []
            }
       
            var nuevo = new noticia_model(item).save();
            res.redirect('/news_listar');
        });
    },

    updateNotice : function(req, res){
        noticia_model.findOne({_id : req.params.id}, function(err, noticia){
                noticia.titulo = req.body.titulo;
                noticia.descripcion = req.body.descripcion;
                noticia.categoria = req.body.categoria;
                noticia.save();
                res.redirect('/news_detail/show/'+noticia._id);
        });
    },
    deleteNotice : function(req, res){
        noticia_model.findOne({_id: req.params.id}, function(err, noticia){
            noticia.remove();
            res.redirect('/news_listar');
        });
    },
    createComment : function(req, res){
        
        var item = {
            autor   : req.body.autor,
            mensaje : req.body.mensaje,
            fecha   : getActualDate()
        }

        noticia_model.findOne({_id : req.params.id}, function(err, noticia){
            noticia.comentarios.push(item);
            noticia.save();
            res.redirect('/news_detail/show/'+noticia._id);
        });
        
    },
    findPrueba : function(req, res){
        noticia_model.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
            console.log( post._id );
          });
    }

};


function getActualDate(){
    var date = new Date();
        
    var today = date.getFullYear()+"-"+(date.getMonth()+1) + "-"+date.getDate(); 
    return today;
}