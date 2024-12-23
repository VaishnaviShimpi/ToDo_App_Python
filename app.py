from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb+srv://shimpivaishnavi23:x5LLWA9tPbEB2L8I@cluster0.cj66t.mongodb.net/Flask_ToDoApp?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)
db = mongo.db.tasks

# Routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    new_task = {
        "title": data["title"],
        "description": data.get("description", ""),
        "completed": False
    }
    result = db.insert_one(new_task)
    return jsonify({"message": "Task added successfully!", "task_id": str(result.inserted_id)}), 201

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = list(db.find())
    task_list = [
        {
            "id": str(task["_id"]),
            "title": task["title"],
            "description": task["description"],
            "completed": task["completed"]
        }
        for task in tasks
    ]
    return jsonify(task_list)

@app.route("/tasks/<task_id>", methods=["PUT"])
def edit_task(task_id):
    data = request.json
    update_data = {}
    if "title" in data:
        update_data["title"] = data["title"]
    if "description" in data:
        update_data["description"] = data["description"]
    if "completed" in data:
        update_data["completed"] = data["completed"]

    result = db.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})
    if result.matched_count == 0:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"message": "Task updated successfully!"})

@app.route("/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    result = db.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"message": "Task deleted successfully!"})

@app.route("/tasks", methods=["DELETE"])
def delete_all_tasks():
    db.delete_many({})
    return jsonify({"message": "All tasks deleted successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
