import type { EmailAddress } from "../value-objects/email-address.vo.js";
import type { EmailBody } from "../value-objects/email-body.vo.js";
import type { EmailHtml } from "../value-objects/email-html.vo.js";
import type { EmailSubject } from "../value-objects/email-subject.vo.js";
import type { UniqueEntityId } from "../value-objects/unique-entity-id.vo.js";
import { Entity } from "./base/base.entity.js";

interface EmailProps {
    from: EmailAddress;
    to: EmailAddress;
    subject: EmailSubject;
    body: EmailBody;
    html?: EmailHtml | undefined;
    createdAt: Date;
}

export class Email extends Entity<EmailProps>{
    private constructor(props: EmailProps, id?: UniqueEntityId){
        super(props, id);
    }

    static create(props: Omit<EmailProps, 'createdAt'>, id?: UniqueEntityId): Email {
        return new Email(
            {
                ...props,
                createdAt: new Date()
            },
            id
        )
    }

    get from(): EmailAddress {
        return this._props.from;
    }

    get to(): EmailAddress {
        return this._props.to;
    }

    get subject(): EmailSubject {
        return this._props.subject;
    }

    get body(): EmailBody {
        return this._props.body;
    }

    get html(): EmailHtml | undefined {
        return this._props.html
    }

    get createdAt(): Date {
        return this._props.createdAt
    }
}