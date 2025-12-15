import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/registerSchema';
import { IoPersonAdd, IoLogIn, IoEyeSharp, IoEyeOffSharp} from 'react-icons/io5'

function RegisterPage() {
    const { register, handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const {signUp, isAuthenticated, errors:registerErrors} = useAuth();
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);

    const togglePasswordVisibility = ()=>{
        setPasswordShown(passwordShown ? false: true);
    }

    const togglePasswordConfirmVisibility = ()=>{
        setPasswordConfirmShown(passwordConfirmShown ? false : true);
    }

    useEffect( ()=>{
        if (isAuthenticated)
            navigate('/inmobilarios');
        
    }, [isAuthenticated]);

    const onSubmit = handleSubmit( async (values)=>{
        console.log(values);
        signUp(values);

    }); //fin de onsubmit

  return (
    <div className='flex items-center justify-center h-screen'>
    <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
        <h1 className='text-3xl font-bold mb-5'>Registro</h1>
        {
            registerErrors.map( (error, i)=>(
                <div className='bg-red-500 p-2 my-2 text-white' key={i}>
              {error}
            </div>      
            ))
        }
        <form onSubmit={onSubmit}>
            <div className='mb-2'>
            <label>Username</label>    
            <input type="text" 
                className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                style={{border: errors.username ? '2px solid red' : ''}}
                placeholder='Nombre de Usuario'
                {
                    ...register("username")
                }
            />
             {
                errors.username && (
                    <span className='text-red-500'>{errors.username.message}</span>
                )
             }
            </div>

            <div className='mb-2'>
            <label>Email</label>
            <input type="email" 
                className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                style={{border: errors.email ? '2px solid red' : ''}}
                placeholder='Email'
                {
                    ...register("email")
                }
            />
            {
                errors.email && (
                    <span className='text-red-500'>{errors.email.message}</span>
                )
             }
            </div>

            <div className='mb-2'>
            <label>Password</label>
            <div className='flex justify-end items-center relative'>
            <input type={passwordShown ? "text" : "password"}
                className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                style={{border: errors.password ? '2px solid red' : ''}}
                placeholder='Contraseña'
                {
                    ...register("password")
                }
            />
            {
                passwordShown ? <IoEyeSharp size={30} className='absolute mr-2 w-10'
                                                         onClick={togglePasswordVisibility} />
                                : <IoEyeOffSharp size={30} className='absolute mr-2 w-10'
                                                        onClick={togglePasswordVisibility} />
            }
            {
                errors.password && (
                    <span className='text-red-500'>{errors.password.message}</span>
                )
            }
            </div>
            </div>
            <div className='mb-2'>
            <label>Password</label>
            <div className='flex justify-end items-center relative'> 
            <input type={passwordConfirmShown ? "text" : "password"}
                className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                style={{border: errors.confirm ? '2px solid red' : ''}}
                placeholder='Confirmar Contraseña'
                {
                    ...register("confirm")
                }
            />
            {
                passwordConfirmShown ? <IoEyeSharp size={30} className='absolute mr-2 w-10'
                                                            onClick={togglePasswordConfirmVisibility} />
                                    : <IoEyeOffSharp size={30} className='absolute mr-2 w-10'
                                                    onClick={togglePasswordConfirmVisibility} />
            }
                {
                    errors.confirm && (
                        <span className='text-red-500'>{errors.confirm.message}</span>
                    )
                }
            </div>
            </div>
            <button type="submit"
                className='bg-transparent hover:bg-zinc-500
                                text-zinc-500 hover:text-white
                                font-semibold py-2 px-4 border-zinc-100 border
                                hover:border-transparent rounded mb-2'
            >
                <IoPersonAdd size={30} />
            </button>
        </form>
        <div className='flex gap-x-2 justify-between pt-5  mt-5'>
            ¿ya tiene una cuenta?
            <Link to='/login' className='text-sky-500'>
               <div className='flex mx-2 px-2 items-start'>
                !Inicia sesion¡
                <IoLogIn size={30} className='mx-1' />
                </div>            
            </Link>
        </div>
    </div>
    </div>
  )
}

export default RegisterPage