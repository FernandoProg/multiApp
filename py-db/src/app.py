from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/py-db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

db = SQLAlchemy(app)

class usuario(db.Model):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(20), nullable=False)
    vehiculo = db.relationship('vehiculo', backref='usuario', cascade='all, delete')

class vehiculo(db.Model):
    __tablename__ = 'vehiculo'
    id = db.Column(db.Integer, primary_key=True)
    patente = db.Column(db.String(6), unique=True, nullable=False)
    modelo = db.Column(db.String(30), nullable=False)
    ruedas = db.Column(db.Integer, nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id', ondelete='CASCADE', onupdate="CASCADE"), nullable=False)

@app.route('/cars', methods=['GET'])
def getCars():
    cars = db.session.query(vehiculo, usuario).join(usuario).all()
    return {
        "cars": [{"id":car.id, "patente":car.patente, "modelo":car.modelo, "ruedas":car.ruedas, "dueño": user.nombre} for car, user in cars]
    }

@app.route('/car', methods=['POST'])
def createCar():
    data=request.get_json()
    car = vehiculo(
        patente=data['patente'],
        modelo=data['modelo'],
        ruedas=data['ruedas'],
        usuario_id=data['usuario_id']
    )
    db.session.add(car)
    db.session.commit()
    return str(car.id)

@app.route('/car/<id>', methods=['GET'])
def getCar(id):
    car = vehiculo.query.filter_by(id=id).first()
    user = usuario.query.filter_by(id=car.usuario_id).first()
    return jsonify({
        "patente": car.patente,
        "modelo": car.modelo,
        "ruedas": car.ruedas,
        "dueño": user.nombre
    })

@app.route('/car/<id>', methods=['DELETE'])
def deleteCar(id):
    car = vehiculo.query.filter_by(id=id).first()
    if car:
        db.session.delete(car)
        db.session.commit()
        return 'Auto eliminado con exito'
    else:
        return 'Auto no fue eliminado'

@app.route('/car/<id>', methods=['PATCH'])
def editCar(id):
    data = request.get_json()
    car = vehiculo.query.filter_by(id=id).first()
    if data['modelo']:
        car.modelo = data['modelo']
    if data['patente']:
        car.patente = data['patente']
    if data['ruedas']:
        car.ruedas = data['ruedas']
    db.session.commit()
    return jsonify({
        "patente": car.patente,
        "modelo": car.modelo,
        "ruedas": car.ruedas
    })
 
@app.route('/usuarios', methods=['GET'])
def getUsers():
    users = usuario.query.all()
    return {"users": [{"id": user.id, "nombre": user.nombre} for user in users]}

@app.route('/usuario', methods=['POST'])
def createUser():
    data = request.get_json()
    user = usuario(
        nombre = data["nombre"]
    )
    db.session.add(user)
    db.session.commit()
    return str(user.id)

@app.route('/usuario/<id>', methods=['GET'])
def getUser(id):
    user = usuario.query.filter_by(id=id).first()
    cars = vehiculo.query.filter_by(usuario_id=user.id).all()
    print([car.patente for car in cars])
    print(cars)
    return jsonify({
        "id": user.id,
        "nombre": user.nombre,
        "vehiculos": [{"patente": car.patente, "modelo": car.modelo, "ruedas": car.ruedas} for car in cars]
    })

@app.route('/usuario/<id>', methods=['PATCH'])
def editUser(id):
    data = request.get_json()
    user = usuario.query.filter_by(id=id).first()
    if data["nombre"]:
        user.nombre = data["nombre"]
    db.session.merge(user)
    db.session.commit()
    return jsonify({
        "id": user.id,
        "nombre": user.nombre
    })

@app.route('/usuario/<id>', methods=['Delete'])
def deleteUser(id):
    user = usuario.query.filter_by(id=id).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return 'Usuario eliminado'
    else:
        return 'No se pudo eliminar el usuario' 

with app.app_context():
    # db.drop_all()
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)