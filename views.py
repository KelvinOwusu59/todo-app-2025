from flask import Blueprint, render_template, redirect, url_for
from flask import request
from task import Task
from flask_login import login_required, current_user
from models import db, Task, User

# Create a blueprint
main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/', methods=['GET', 'POST'])
@login_required
def todo():
    # if request.method == 'POST':
    #     task = request.form['task-text']
    #     print(task)
    #     new_task = Task(title=task, user_id=current_user.id)
    #     db.session.add(new_task)
    #     db.session.commit()

    #tasks = Task.query.filter_by(user_id=current_user.id).all()
    #return render_template('todo.html', tasks=tasks)
    return render_template('todo.html')

@main_blueprint.route('/api/v1/tasks', methods=['GET'])
@login_required
def api_get_tasks():
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return {
        "tasks": [task.to_dict() for task in tasks]
    }

@main_blueprint.route('/api/v1/tasks', methods=['POST'])
@login_required
def api_create_task():
    data = request.get_json()
    new_task = Task(title=data['title'], user_id=current_user.id, priority=data.get('priority', 'low'))
    db.session.add(new_task)
    db.session.commit()
    return {
        "task": new_task.to_dict()
    }, 201

@main_blueprint.route('/api/v1/tasks/<int:task_id>', methods=['PATCH'])
@login_required
def api_toggle_task(task_id):
    task = Task.query.get(task_id)

    if task is None:
        return {"error": "Task not found"}, 404

    task.toggle()
    db.session.commit()

    return {"task": task.to_dict()}, 200

@main_blueprint.route('/remove/<int:task_id>')
@login_required
def remove(task_id):
    task = Task.query.get(task_id)

    if task is None:
        return redirect(url_for('main.todo'))

    db.session.delete(task)
    db.session.commit()

    return redirect(url_for('main.todo'))