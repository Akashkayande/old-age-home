from flask import Blueprint, request, jsonify
from db import get_db_connection
import bcrypt

auth_bp = Blueprint('auth', __name__)

# REGISTER
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)",
        (email, hashed_password.decode('utf-8'), 'user')
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "User registered successfully!"})


# LOGIN
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if user:
        stored_password = user[2]

        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            return jsonify({
                "message": "Login successful",
                "role": user[3]   # admin or user
            })

    return jsonify({"message": "Invalid credentials"}), 401


@auth_bp.route('/add-need', methods=['POST'])
def add_need():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO needs (item, quantity, description) VALUES (%s, %s, %s)",
        (data['item'], data['quantity'], data['description'])
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Need added successfully"})

@auth_bp.route('/get-needs', methods=['GET'])
def get_needs():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM needs")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    needs = []
    for r in rows:
        needs.append({
            "id": r[0],
            "item": r[1],
            "quantity": r[2],
            "description": r[3]
        })

    return jsonify(needs)

@auth_bp.route('/delete-need/<int:id>', methods=['DELETE'])
def delete_need(id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM needs WHERE id = %s", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "Need deleted"})


@auth_bp.route('/donate', methods=['POST'])
def donate():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """INSERT INTO donation (name, phone, item, message, need_id, email)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (
            data['name'],
            data['phone'],
            data['item'],
            data['message'],
            data['need_id'],
            data['email'],
        )
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Donation submitted successfully"})

@auth_bp.route('/volunteer', methods=['POST'])
def volunteer():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO volunteers (name, email, phone, area) VALUES (%s, %s, %s, %s)",
        (data['name'], data['email'], data['phone'], data['area'])
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Volunteer registered"})

@auth_bp.route('/get-volunteers', methods=['GET'])
def get_volunteers():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM volunteers")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "name": r[1],
            "email": r[2],
            "phone": r[3],
            "area": r[4]
        })

    return jsonify(result)

@auth_bp.route('/get-donations', methods=['GET'])
def get_donations():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM donation")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "name": r[1],
            "phone": r[2],
            "item": r[3],
            "message": r[4],
            "need_id": r[5],
            "email": r[6]
        })

    return jsonify(result)