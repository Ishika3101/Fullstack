import React,{useState} from 'react';
import {useDispatch} from 'react-redux';
import {addTodo} from '../features/todo/todoSlice';

//adding a todo so that we will use dispatch 
function AddTodo () {
  const[input,setInput]= useState('')
  const dispatch=useDispatch()

  const addTodoHandler =(e)=>{
    e.preventDefault();
    dispatch(addTodo(input))  //input is the payload 
  }
  return ( 
    <div>
      
    </div>
  )
}

export default AddTodo
