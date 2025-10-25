import { User } from 'src/database';

export class AuthBuilder {
	private id: string;
	private numdocument: string;
	private password: string;
	private typedocument: string;
	private isactive: boolean;

	setId(id: string): AuthBuilder {
		this.id = id;
		return this;
	}

	setNumDocument(numDocument: string): AuthBuilder {
		this.numdocument = numDocument;
		return this;
	}

	setPassword(password: string): AuthBuilder {
		this.password = password;
		return this;
	}
	setTypeDocument(typeDocument: string): AuthBuilder {
		this.typedocument = typeDocument;
		return this;
	}

	setIsActive(isActive: boolean): AuthBuilder {
		this.isactive = isActive;
		return this;
	}

	build(): User {
		const user = new User();
		user.id = this.id;
		user.numdocument = this.numdocument;
		user.password = this.password;
		user.typedocument = this.typedocument;
		user.isactive = this.isactive;
		return user;
	}
	static create(): AuthBuilder {
		return new AuthBuilder();
	}
}
