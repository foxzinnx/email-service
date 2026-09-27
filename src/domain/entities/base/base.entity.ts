import { UniqueEntityId } from "../../value-objects/unique-entity-id.vo.js";

export class Entity<Props>{
    private readonly _id: UniqueEntityId;
    protected _props: Props;

    constructor(props: Props, id?: UniqueEntityId){
        this._id = id ?? new UniqueEntityId(id);
        this._props = props;
    }

    get id(): UniqueEntityId {
        return this._id;
    }

    equals(other: Entity<Props>): boolean {
        return this._id.equals(other._id);
    }
}