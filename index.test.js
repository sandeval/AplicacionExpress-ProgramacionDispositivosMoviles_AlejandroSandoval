import { describe, it, expect, afterAll } from 'bun:test'
import { app, db } from './index'

describe('API Endpoints', () => {

    // Cerramos la conexión a la BD al terminar todos los tests
    afterAll(() => {
        db.close()
    })

    // 1. Test para GET /
    describe('GET /', () => {
        it('Debería retornar status 200 y el objeto { status: "ok" }', async () => {
            const res = await app.request('/')

            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ status: 'ok' })
        })
    })

    // 1.b Test para GET /todos
    describe('GET /todos', () => {
        it('Debería retornar status 200 y un arreglo (lista de tareas)', async () => {
            // Insertamos una tarea para asegurar que la lista no esté vacía
            await app.request('/agrega_todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: 'Tarea de prueba para listar' }),
            })

            const res = await app.request('/todos')
            expect(res.status).toBe(200)

            const lista = await res.json()
            expect(Array.isArray(lista)).toBe(true)
            expect(lista.length).toBeGreaterThan(0)
            expect(lista[0]).toHaveProperty('id')
            expect(lista[0]).toHaveProperty('todo')
            expect(lista[0]).toHaveProperty('created_at')
        })
    })

    // 2. Test para POST /login
    describe('POST /login', () => {
        it('Debería retornar status 200 al hacer login', async () => {
            const res = await app.request('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'test', password: '123' }),
            })

            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ status: 'ok' })
        })
    })

    // 3. Tests para POST /insert
    describe('POST /insert', () => {

        it('Debería crear una tarea correctamente (Status 201)', async () => {
            const res = await app.request('/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: 'Aprender Bun' }),
            })

            expect(res.status).toBe(201)
            expect(await res.json()).toHaveProperty('message', 'Insert was successful')
        })

        it('Debería fallar si no se envía el campo "todo" (Status 400)', async () => {
            const res = await app.request('/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            })

            expect(res.status).toBe(400)
        })
    })

    // 4. Tests para POST /agrega_todo
    describe('POST /agrega_todo', () => {

        it('Debería agregar un todo correctamente (Status 201)', async () => {
            const res = await app.request('/agrega_todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: 'Estudiar para el examen de moviles' }),
            })

            expect(res.status).toBe(201)
            const json = await res.json()
            expect(json).toHaveProperty('message', 'Todo agregado exitosamente')
            expect(json).toHaveProperty('id')
        })

        it('Debería fallar si no se envía el campo "todo" (Status 400)', async () => {
            const res = await app.request('/agrega_todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            })

            expect(res.status).toBe(400)
        })
    })
})
