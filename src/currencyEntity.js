class CurrencyEntity {
    constructor(entity) {
        this.charCode=entity.CharCode
        this.nominal=entity.Nominal
        this.name=entity.Name
        this.value=entity.Value
        this.previous=entity.Previous
    }
}

export{CurrencyEntity}