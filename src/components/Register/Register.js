import React from 'react'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            name : "",
            entries : "",
            joined : "",
        }
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    onNameChange = (event) => {
        this.setState({name: (event.target.value.charAt(0).toUpperCase() + event.target.value.slice(0).toLowerCase())})
    }

    onSubmitRegister = (event) => {
        console.log(JSON.stringify(this.state));
        fetch("http://localhost:3001/register", {
            method: "post",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                email: this.state.email,
                password : this.state.password,
                name: this.state.name
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    console.log(data)
                    this.props.loadUser(data);
                    this.props.onRouteChange("home");
                }
            })
        
    }

    render() {
        const { onRouteChange } = this.props
        return (
            <article className="br3 ba dark-gray b--black-10 mv5 mw6 shadow-5 ma2 center">
                <main className="ma3 pa2 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="text" 
                                name="name"  
                                id="name"
                                onChange={ this.onNameChange }
                            />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="email" 
                                name="email-address"  
                                id="email-address"
                                onChange={ this.onEmailChange }
                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="password" 
                                name="password"  
                                id="password"
                                onChange={ this.onPasswordChange }
                            />
                        </div>
                        </fieldset>
                            <div className="">
                            <input 
                                onClick={this.onSubmitRegister} 
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" 
                                value="Register"
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p 
                                onClick={() => onRouteChange("signin")} 
                                className="f6 link dim black db pointer">Sign In
                            </p>
                        </div>
                    </div>
                </main>
            </article>
        )
    }
}

export default Register