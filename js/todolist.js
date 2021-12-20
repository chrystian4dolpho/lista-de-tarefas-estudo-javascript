;'use strict';
const addItemInput = document.getElementById('item-input');
const form = document.getElementById('todo-add');
const list = document.getElementById('todo-list')

//buscar tarefas
let db = []; // dados alocados no Storage

if(!localStorage.getItem('tasks')){
    localStorage.setItem('tasks', JSON.stringify(db));
}

db = JSON.parse(localStorage.getItem('tasks'));

db.forEach( task => {

    function isDone(){
        if(task.status === 'done'){
            return
        }
        return 'displayNone';
    };

    let taskShape = `
    <li class="todo-item" name=${task.name} estado=${task.status}>
    <button class="button-check">
        <i class="fas fa-check ${isDone()}"></i>
    </button>
    <p class="task-name">${task.name}</p>
    <i class="fas fa-edit"></i>
    <i class="fas fa-trash-alt"></i>
    </li>
    `;

    list.innerHTML += taskShape;

})


//adicionar tarefa
function addItem(event){

    let itemTitle = addItemInput.value;

    if(!itemTitle){
        alert('Preencha o campo Novo Item');
    } else {
        
            const item = document.createElement('li');
            item.classList.add('todo-item');

            const taskCheck = document.createElement('button');
            taskCheck.classList.add('button-check');
            
            const checked = document.createElement('i');
            checked.classList.add('fas', 'fa-check', 'displayNone');
            
            taskCheck.appendChild(checked);
            
            const taskName = document.createElement('p');
            taskName.classList.add('task-name');
            taskName.textContent = itemTitle;
            
            const editBtn = document.createElement('i');
            editBtn.classList.add('fas', 'fa-edit');
            
            const excludeBtn = document.createElement('i');
            excludeBtn.classList.add('fas', 'fa-trash-alt');
            
            const itemChildren = {
                taskCheck: taskCheck,
                taskName: taskName,
                editBtn: editBtn,
                excludeBtn: excludeBtn
            };

            for(let element in itemChildren){
                item.appendChild(itemChildren[element]);
            }

            item.setAttribute('name', itemTitle);
            item.setAttribute('status', 'todo');

            db.push({
                'name': itemTitle,
                'status': 'todo'
            })

            localStorage.setItem('tasks', JSON.stringify(db));
            list.appendChild(item);

        }

   event.preventDefault();

}

form.addEventListener('submit', addItem);


//manipulando estados de tarefa
list.addEventListener('click', (event) => { 

    if(event.target.classList.contains('button-check')){
        let specificCheckBox = event.target.getElementsByTagName('i')[0];
        specificCheckBox.classList.toggle('displayNone');
        
        event.target.parentNode.setAttribute('status', 'done');

        db.forEach(function(task){
            if(task.name === event.target.parentNode.getAttribute('name')){
                task.status = 'done';
            }
        })

        localStorage.setItem('tasks', JSON.stringify(db));

        event.stopPropagation();
    }

    if(event.target.classList.contains('fa-edit')){ openItemEdition(event); }

    if(event.target.classList.contains('fa-trash-alt')){ excludeItem(event); }
        
})


//editar tarefa
function openItemEdition(event){

    const editInput = document.createElement('div');
    editInput.classList.add('editContainer');

    const editTextInput = document.createElement('input');
    editTextInput.setAttribute('type', 'text');
    editTextInput.classList.add('editInput');

    const editConfirmBtn = document.createElement('button');
    editConfirmBtn.textContent = 'Edit';
    editConfirmBtn.classList.add('editButton');

    const editCancelBtn = document.createElement('button');
    editCancelBtn.textContent = 'Cancel';
    editCancelBtn.classList.add('cancelButton');

    const divProps = {
        editTextInput,
        editConfirmBtn,
        editCancelBtn
    }

    for(let prop in divProps){
        editInput.appendChild(divProps[prop]);
    }

    const item = event.target.parentNode;
    item.insertBefore(editInput, item.lastChild);

    const editor = item.querySelector('.editContainer');
    editor.style.display = 'flex';
    
    editor.addEventListener('click', function actions(event){
        if(event.target.classList.contains('editButton')){
            let input = editor.querySelector('.editInput').value;
            if(!input){
                alert('O nome não pode ser vazio!');
                event.preventDefault();
            } else {
                
                let oldInput = item.querySelector('.task-name');

                db.forEach((task)=>{
                    if(oldInput.parentNode.getAttribute('name') === task.name){
                        task.name = input;
                    }
                })

                localStorage.setItem('tasks', JSON.stringify(db));
                oldInput.textContent = input;

                editor.style.display = 'none';
                editor.removeEventListener('click', actions);
            }
            
        }

        if(event.target.classList.contains('cancelButton')){
            editor.style.display = 'none';
            editor.removeEventListener('click', actions);
        }
    })

}


//excluir tarefa
function excludeItem(event){

    db = db.filter((task)=>{
        if(event.target.parentNode.getAttribute('name') !== task.name){return task}
    })

    localStorage.setItem('tasks', JSON.stringify(db));
    
    list.removeChild(event.target.parentNode);

}