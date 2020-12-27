import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import "./RegisterForm.scss"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast }from 'react-toastify'
import { useMutation } from '@apollo/client'
import { REGISTER } from '../../../gql/user'

export default function RegisterForm({ setShowLogin }) {

    const [register] = useMutation(REGISTER)

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object({
            name: Yup.string().required("Tu nombre es obligatorio."),
            username: Yup.string().matches(
                /^[a-zA-Z0-9-]*$/, 
                "El nombre del usuario no puede tener espacios"
            )
            .required("El nombre de usuario es obligatorio"),
            email: Yup.string().email("El email no es valido").required("El email es obligatorio"),
            password: Yup.string().required("La contraseña es obligatoria")
                .oneOf([Yup.ref("repeatPassword")], "Las contraseñas no son iguales."),
            repeatPassword: Yup.string().required("La contraseña es obligatoria")
                .oneOf([Yup.ref("password")], "Las contraseñas no son iguales"),

        }),
        onSubmit: async (formData) => {
            try {
                const newUser = formData
                delete newUser.repeatPassword
                await register({
                    variables:{
                        input: newUser
                    }
                })
                toast.success("El usuario se ha registrado correctamente")
                setShowLogin(false)
            } catch (error) {
                toast.error(error.message)
                console.log(error.message)
            }
        }
    })

    return (
        <>
            <h2 className="register-form-title">Registrate para ver fotos y videos de tus amigos</h2>
            <Form className="register-form" onSubmit={formik.handleSubmit}>
                <Form.Input
                    type="text"
                    placeholder="Nombre y Apellidos"
                    name="name"
                    onChange={formik.handleChange}
                    error={formik.errors.name && true}
                />
                <Form.Input
                    type="text"
                    placeholder="Nombre de Usuario"
                    name="username"
                    onChange={formik.handleChange}
                    error={formik.errors.username && true}
                />
                <Form.Input
                    type="text"
                    placeholder="Correo Electrónico"
                    name="email"
                    onChange={formik.handleChange}
                    error={formik.errors.email && true}
                />
                <Form.Input
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    onChange={formik.handleChange}
                    error={formik.errors.password}
                />
                <Form.Input
                    type="password"
                    placeholder="Repetir Contraseña"
                    name="repeatPassword"
                    onChange={formik.handleChange}
                    error={formik.errors.repeatPassword}
                />
                <Button className="btn-submit" type="submit">Registrarse</Button>
            </Form>
        </>
    )
}

function initialValues() {
    return{
        name: "",
        username: "",
        email: "",
        password: "",
        repeatPassword: ""
    }
}
