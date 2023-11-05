class GeneralEntity{
    constructor(entity) {
        this.date = entity.Date
        this.previousDate = entity.PreviousDate
        this.previousURL = entity.PreviousURL
        this.timestamp = entity.Timestamp
        this.valute = entity.Valute
    }
}

export{GeneralEntity}