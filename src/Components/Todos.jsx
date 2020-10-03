import React, {useCallback, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure
} from "@chakra-ui/core";

function AddTodo() {
    const [item, setItem] = React.useState("")

    const handleInput = e => {
        setItem(e.target.value)
    }

    const handleSubmit = (e) => {
        const newTodo = {
            "id": uuidv4(),
            "item": item
        }

        return fetch('http://localhost:8000/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <InputGroup size="md">
                <Input
                    pr='4.5rem'
                    type="text"
                    placeholder="Add a todo item"
                    aria-label="Add a todo item"
                    onChange={handleInput}
                />
            </InputGroup>
        </form>
    )
}

function UpdateTodo({item, id}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [todo, setTodo] = useState(item)

    const updateTodo = async () => {
        console.log(id)
        await fetch(`http://localhost:8000/todo/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item: todo
            })
        })
        onClose()
        return window.location.reload()
    }

    return (
        <>
            <Button h="1.5rem" size="sm" onClick={onOpen}>Update Todo</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Update Todo</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <InputGroup size="md">
                            <Input
                                pr='4.5rem'
                                type="text"
                                placeholder="Add a todo item"
                                aria-label="Add a todo item"
                                value={todo}
                                onChange={e => setTodo(e.target.value)}
                            />
                        </InputGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button h="1.5rem" size="sm" onClick={updateTodo}>Update Todo</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

function DeleteTodo({id}) {
    const deleteTodo = async () => {
        await fetch(`http://localhost:8000/todo/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "id": id
            }
        })
        return window.location.reload()
    }
    return (
        <Button h="1.5rem" size="sm" onClick={deleteTodo}>Delete Todo</Button>
    )
}

function TodoHelper({item, id}) {
    return (
        <Box p={1} shadow="sm">
            <Flex justify="space-between">
                <Text mt={4} as="div">
                    {item}
                    <Flex align="end">
                        <UpdateTodo item={item} id={id}/>
                        <DeleteTodo id={id} />
                    </Flex>
                </Text>
            </Flex>
        </Box>
    )
}

export default function Todos() {
    const [todos, setTodos] = React.useState([])

    const fetchTodos = useCallback(async () => {
        const response = await fetch('http://localhost:8000/todo')
        const todos = await response.json()
        setTodos(todos.data)
    }, [])

    useEffect(() => {
        fetchTodos()
    }, [fetchTodos])

    return (
        <>
            <AddTodo />
            <Stack spacing={5}>
                {todos.map((todo) => (
                    <TodoHelper item={todo.item} id={todo.id}/>
                ))}
            </Stack>
        </>
    )
}