import { User } from "./user";

export class UserBuilder {
  private user: User = {};

  setName(name: string): this {
    this.user.name = name;

    return this;
  }

  setAge(age: number): this {
    this.user.age = age;

    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;

    return this;
  }

  setCity(city: string): this {
    this.user.city = city;

    return this;
  }

  build(): User {
    return this.user;
  }
}
