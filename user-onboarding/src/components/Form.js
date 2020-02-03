import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';



const UserForm = ({ values, errors, touched, status }) => {
    const [users, setUser] = useState([]);

    useEffect(() => {
        console.log("status changed", status);
        status && setUser(users => [...users, status]);
    }, [status]);

    return (
        <div className='user-form'>
            <Form>
                {/* Name Input */}
                <label htmlFor="name">Name:</label>
                <Field type="text" name="name" id="name" />
                {touched.name && errors.name && (
                    <p>{errors.name}</p>
                )}

                {/* Email Input */}
                <label htmlFor="email">Email:</label>
                <Field type="email" name="email" id="email" />
                {touched.email && errors.email && (
                    <p>{errors.email}</p>
                )}

                {/* Password Input */}
                <label htmlFor="password">Password:</label>
                <Field type="password" name="password" id="password" />

                {/* TOS Checkbox */}
                <label htmlFor="tos">Terms of Service</label>
                <Field type="checkbox" name="tos" id="tos" checked={values.tos} />

                {/* Submit Button */}
                <button type="submit">Submit</button>
            </Form>
            {users.map(user => {
                return (
                    <ul key={user.id}>
                        <li>Name: {user.name}</li>
                        <li>Email: {user.email}</li>
                    </ul>
                )
            })}
        </div>

    );
};

const FormikUserForm = withFormik({
    mapPropsToValues({ name, email, tos }) {
        return {
            name: name || "",
            email: email || "",
            tos: tos || false,
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().min(2, 'Must be at least 2 characters').required("Name is required"),
        email: Yup.string().email().required('Email is required')
    }),
    handleSubmit(values, { setStatus }) {
        console.log("Submitting", values);
        axios
            .post('https://reqres.in/api/users/', values)
            .then(res => {
                console.log('success', res);
                setStatus(res.data);
            })
            .catch(err => {
                console.log(err.response);
            });
    }
})(UserForm);

export default FormikUserForm;