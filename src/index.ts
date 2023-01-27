import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/Knex'
import { TUser, TProduct } from './types'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// =======================Get all users==============================

app.get('/users', async (req: Request, res: Response) => {

    try {
        // const result = await db.raw(`SELECT * FROM users`)
        const result = await db("users")

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

// =======================Create user==============================

app.post("/users", async (req: Request, res: Response) => {
    try {
        const { id, name, email, password, created_at } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' deve ser string")
        }

        if (name.length < 2) {
            res.status(400)
            throw new Error("'name' deve possuir pelo menos 2 caracteres")
        }

        if (typeof email !== "string") {
            res.status(400)
            throw new Error("'email' deve ser string")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        const [userIdAlreadyExists]: TUser[] | undefined[] = await db("users").where({ id })

        if (userIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const [userEmailAlreadyExists]: TUser[] | undefined[] = await db("users").where({ email })

        if (userEmailAlreadyExists) {
            res.status(400)
            throw new Error("'email' já existe")
        }

        const newUser: TUser = {
            id,
            name,
            email,
            password,
            created_at
        }

        await db("users").insert(newUser)

        res.status(201).send({
            message: "Cadastro realizado com sucesso",
            user: newUser
        })

        //  await db("user").insert({id, email, password, created_at})
        //     res.status(201).send("Cadastro realizado com sucesso")


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//====================Create product=====================================

app.post("/products", async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, image_url } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' deve ser string")
        }

        if (name.length < 2) {
            res.status(400)
            throw new Error("'name' deve possuir pelo menos 2 caracteres")
        }

        if (typeof price !== "number") {
            res.status(400)
            throw new Error("'price' deve ser number")
        }

        if (typeof description !== "string") {
            res.status(400)
            throw new Error("'description' deve ser string")
        }

        if (typeof image_url !== "string") {
            res.status(400)
            throw new Error("'image_url' deve ser string")
        }
        const [userIdAlreadyExists]: TUser[] | undefined[] = await db("products").where({ id })

        if (userIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }


        await db("products").insert({ id, name, price, description, image_url })
        res.status(201).send("Produto Cadastrado com sucesso")


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//====================Get all products funcionalidade 1=====================================

app.get("/products", async (req: Request, res: Response) => {
    try {

        const result = await db("products")

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//====================Get all products funcionalidade 2=====================================

app.get("/products", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined) {
            const result = await db("products")
            res.status(200).send(result)
        } else {
            const result = await db("products")
                .where("name", "LIKE", `%${searchTerm}%`)

            res.status(200).send(result)
        }
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//====================Edit product by id=====================================

app.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        const newPrice = req.body.price
        const newDescription = req.body.description
        const newImage_url = req.body.image_url

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newId.length < 4) {
                res.status(400)
                throw new Error("'id' deve possuir pelo menos 4 caracteres")
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 2) {
                res.status(400)
                throw new Error("'name' deve possuir pelo menos 2 caracteres")
            }
        }

        if (typeof newPrice !== "number") {
            res.status(400)
            throw new Error("'price' deve ser number")
        }

        if (newDescription !== undefined) {
            if (typeof newDescription !== "string") {
                res.status(400)
                throw new Error("'description' deve ser string")
            }
        }

        if (typeof newImage_url !== "string") {
            res.status(400)
            throw new Error("'image_url' deve ser string")
        }

        const [product]: TProduct[] | undefined[] = await db("products").where({ id: idToEdit })

        if (!product) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        const newProduct = {
            id: newId || product.id,
            name: newName || product.name,
            price: newPrice || product.price,
            description: newDescription || product.description,
            image_url: newImage_url || product.image_url
        }
        
        await db("products").update(newProduct).where({ id: idToEdit })

        res.status(200).send({
            message: "Produto atualizado com sucesso",
            task: newProduct
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//====================Create purchase=====================================

app.post("/purchases", async (req: Request, res: Response) => {

    try {
        const { id,buyer_id, total_price} = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof buyer_id !== "string") {
            res.status(400)
            throw new Error("'Buyer_id' deve ser string")
        }

        if (buyer_id.length < 4) {
            res.status(400)
            throw new Error("'buyer_id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof total_price !== "number") {
            res.status(400)
            throw new Error("'total_price' deve ser number")
        }

        const [ purchaseIdAlreadyExists ] = await db("purchases").where({ id })

        if (purchaseIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

         await db("purchases").insert({id, buyer_id, total_price})
       
       

        const [ insertedPurchase ] = await db("purchases").where({ id })

        res.status(201).send({
            message: "Pedido realizado com sucesso",
            purchase: insertedPurchase
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// =======================Delete purchase by id================================

app.delete("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        if (idToDelete[0] !== "p") {
            res.status(400)
            throw new Error("'id' deve iniciar com a letra 'p'")
        }

        const [ taskIdToDelete ]= await db("purchases").where({ id: idToDelete })

        if (!taskIdToDelete) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        await db("purchases_products").del().where({ purchase_id: idToDelete })
        await db("purchases").del().where({ id: idToDelete })

        res.status(200).send({ message: "Pedido cancelado com sucesso" })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// ===================Get purchase by id========================================

app.get("/purchases/:id", async (req: Request, res: Response) => {


    try {

        const purchaseIdToSearch = req.params.id
 
      if (purchaseIdToSearch !== ":id") {
        const [checkPurchase] = await db.select("*").from("purchases").where({id: purchaseIdToSearch})

        if (checkPurchase){
            const purchaseWithProducts = await db("purchases_products")
            .innerJoin("purchases","purchases_products.purchases_id", "*", "purchases.id")
            .where({purchase_id:purchaseIdToSearch})
            .innerJoin("products", "purchases_products.product_id", "=","products.id")
            .where({purchase_id:purchaseIdToSearch})
            res.status(200)
            .send(purchaseWithProducts)
        }

      else{
        res.status(400)
        throw new Error ("Compra com o `id` não encontrado")
      }
    }
    else{
        res.status(400).send("Um `id` deve ser informado")
    }
      
    } catch (error) {
        console.log(error)
    
        if (req.statusCode === 200) {
          res.status(500)
        }
    
        if (error instanceof Error) {
          res.send(error.message)
        } else {
          res.send("Erro inesperado")
        }
      }
    })
    