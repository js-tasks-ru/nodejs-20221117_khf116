import React, { Component } from 'react';
import axios from "axios";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      displayName: '',
      email: '',
      password: '',
      success: false,
      isLoading: false,
      error: null,
    };
  }

  render() {
    const { displayName, email, password, success, isLoading, error } = this.state;
    
    if (success) {
      return (
        <div className="text-center border border-light p-5">
          <p className="h4 mb-4">Поздравляем, вы зарегистрированы!</p>
          <p>На указанную вами почту отправлено письмо.</p>
          <p>Для завершения регистрации, пожалуйста, перейдите по ссылке из этого письма.</p>
        </div>
      );
    }
    
    return (
      <React.Fragment>
        <form className="signup-container" onSubmit={this.onSubmit.bind(this)}>
          <img className="mb-4"
               src="https://getbootstrap.com/docs/4.4/assets/brand/bootstrap-solid.svg"
               alt="icon" width="72" height="72" />
          <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
          {!!error &&
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          }
          <label htmlFor="inputEmail" className="sr-only">Email</label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email"
                 autoFocus disabled={isLoading}
                 value={email} onChange={this.onEmailChanged.bind(this)} />
          <label htmlFor="inputDisplayName" className="sr-only">Имя</label>
          <input type="text" id="inputDisplayName" className="form-control" placeholder="Имя"
                 disabled={isLoading}
                 value={displayName} onChange={this.onDisplayNameChanged.bind(this)} />
          <label htmlFor="inputPassword" className="sr-only">Пароль</label>
          <input type="password" id="inputPassword" className="form-control"
                 placeholder="Пароль" disabled={isLoading}
                 value={password} onChange={this.onPasswordChanged.bind(this)} />
          <button className="btn btn-lg btn-primary btn-block" type="submit"
                  disabled={isLoading}>
            Регистрация
          </button>
        </form>
      </React.Fragment>
    );
  }
  
  onSubmit(event) {
    event.preventDefault();
    
    const { displayName, email, password, isLoading } = this.state;
    
    if (isLoading) return;
    
    if (!displayName || !email || !password) {
      this.setState({
        error: 'Все поля формы обязательные для заполнения'
      });
      return;
    }
    
    this.setState({
      error: null,
      isLoading: true,
    });
    
    axios.post('/api/register', {
      displayName, email, password
    }).then(() => {
      this.setState({
        isLoading: false,
        success: true,
      });
    }).catch(error => {
      this.setState({
        isLoading: false,
        error: error.response.data.error,
      });
    })
  }
  
  onDisplayNameChanged(event) {
    this.setState({
      displayName: event.target.value,
    });
  }
  
  onEmailChanged(event) {
    this.setState({
      email: event.target.value,
    });
  }
  
  onPasswordChanged(event) {
    this.setState({
      password: event.target.value,
    });
  }
}
