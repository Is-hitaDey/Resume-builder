import React from 'react'
import "../auth.form.scss"

function Login() {
  return (
    <div>
      <main>
        <div className='form-container'>
            <h1>Login</h1>
            <form >
                <div className="input-group">
                    <label htmlFor='email'>Email</label>
                    <input type="email" id="email" name="email" placeholder="Write your email address"/>
                </div>
                <div className="input-group">
                    <label htmlFor='password'>Password</label>
                    <input type="password" id="password" name="password" placeholder="Give a password "/>
                </div>

                <button className='button primary-button'>Login</button>
                
            </form>
        </div>
      </main>
    </div>
  )
}

export default Login
