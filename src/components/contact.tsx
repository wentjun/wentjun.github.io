'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { Component } from 'react';
import AnchorLink from '../utilities/anchor-link';
import contactStyles from './contact.module.css';

interface FormErrors {
  name: string;
  _replyto: string;
  message: string;
}

interface ContactState {
  name: string;
  _replyto: string;
  message: string;
  errors: FormErrors;
}

type ValidatedField = keyof FormErrors;

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Contact extends Component<Record<string, never>, ContactState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      name: '',
      _replyto: '',
      message: '',
      errors: {
        name: '',
        _replyto: '',
        message: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  validateForm(field: ValidatedField, value: string) {
    let {
      name: nameErrorMessage,
      _replyto: emailErrorMessage,
      message: messageErrorMessage,
    } = this.state.errors;

    switch (field) {
      case 'name':
        if (value.length < 1) {
          nameErrorMessage = 'This field cannot be empty.';
        } else {
          nameErrorMessage = '';
        }
        break;
      case '_replyto':
        if (value.length < 1) {
          emailErrorMessage = 'This field cannot be empty.';
        } else if (!emailRegex.test(value)) {
          emailErrorMessage = 'Please enter a valid email.';
        } else {
          emailErrorMessage = '';
        }
        break;
      case 'message':
        if (value.length < 1) {
          messageErrorMessage = 'This field cannot be empty.';
        } else {
          messageErrorMessage = '';
        }
        break;
      default:
        break;
    }
    this.setState({
      errors: {
        name: nameErrorMessage,
        _replyto: emailErrorMessage,
        message: messageErrorMessage,
      },
    });
  }

  handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    const field = name as ValidatedField;
    this.setState({
      [field]: value,
    } as Pick<ContactState, ValidatedField>);
    this.validateForm(field, value);
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    const { name, _replyto, message } = this.state;
    let {
      name: nameErrorMessage,
      _replyto: emailErrorMessage,
      message: messageErrorMessage,
    } = this.state.errors;

    if (name.length < 1) {
      nameErrorMessage = 'This field cannot be empty.';
    } else {
      nameErrorMessage = '';
    }

    if (_replyto.length < 1) {
      emailErrorMessage = 'This field cannot be empty.';
    } else if (!emailRegex.test(_replyto)) {
      emailErrorMessage = 'Please enter a valid email.';
    } else {
      emailErrorMessage = '';
    }

    if (message.length < 1) {
      messageErrorMessage = 'This field cannot be empty.';
    } else {
      messageErrorMessage = '';
    }

    this.setState({
      errors: {
        name: nameErrorMessage,
        _replyto: emailErrorMessage,
        message: messageErrorMessage,
      },
    });

    if (nameErrorMessage || emailErrorMessage || messageErrorMessage) {
      event.preventDefault();
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <section className={contactStyles.contact__cover}>
          <div className={contactStyles.contact__contentQuote}>
            <header>
              <span>Your greatest dreams are all on the other side of </span>
              <span>the wall of fear and caution</span>
            </header>
          </div>
          <AnchorLink location="contact" />
        </section>
        <section
          id="contact"
          className={`wrapper ${contactStyles.contact__formWrapper}`}
        >
          <div className="container">
            <header className="text-center">
              <h2>Say Hello</h2>
              <p>I'd love to hear from you</p>
            </header>
            <form
              onSubmit={this.handleSubmit}
              action="https://formspree.io/mpzrvyvw"
              method="post"
            >
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <input
                    type="text"
                    placeholder="Your name"
                    name="name"
                    onChange={this.handleChange}
                    aria-label="Your name"
                  ></input>
                  {errors.name.length > 0 && (
                    <span className="error">{errors.name}</span>
                  )}
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <input
                    type="email"
                    placeholder="Your email"
                    name="_replyto"
                    onChange={this.handleChange}
                    aria-label="Your email"
                  ></input>
                  {errors._replyto.length > 0 && (
                    <span className="error">{errors._replyto}</span>
                  )}
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <input
                    type="text"
                    placeholder="Subject"
                    name="_subject"
                    aria-label="Subject"
                  ></input>
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Your message"
                    onChange={this.handleChange}
                    aria-label="Your message"
                  ></textarea>
                  {errors.message.length > 0 && (
                    <span className="error">{errors.message}</span>
                  )}
                </div>
              </div>
              <div className={contactStyles.contact__formElement}>
                <div className={contactStyles.contact__formGroup}>
                  <button type="submit" value="Send">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

export default Contact;
