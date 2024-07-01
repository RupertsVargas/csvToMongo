const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test', {

})

const db = mongoose.connection;

// Definir el esquema de MongoDB
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  // Define aquí los campos que esperas del CSV
  // Ejemplo:
  name: String,
  lastname: String,
  age: Number,

});

const DataModel = mongoose.model('data', dataSchema);

    
// Función para procesar el archivo CSV y guardar en MongoDB
function processData(filePath) {
  return new Promise((resolve, reject) => {
    let results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        DataModel.insertMany(results)
          .then(() => {
            console.log(results);
            console.log('Datos insertados en MongoDB');
            resolve();
          })
          .catch((err) => {
            console.error(results);
            console.error('Error al insertar datos:', err);
            reject(err);
          });
      })
      .on('error', (err) => {
        console.error('Error al leer el archivo CSV:', err);
        reject(err);
      });
  });
}

// Ejemplo de uso
const filePath = 'archivo.csv'; // Reemplaza con la ruta de tu archivo CSV
processData(filePath)
  .then(() => {
    console.log('Proceso completado');
    db.close(); // Cerrar la conexión a MongoDB al finalizar
  })
  .catch((err) => {
    console.error('Error en el proceso:', err);
    db.close(); // Asegurarse de cerrar la conexión en caso de error
  });
