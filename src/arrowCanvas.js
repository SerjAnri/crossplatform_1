class ArrowCanvas {

    constructor(canvas) {
        this.canvas = canvas
    }

    clear() {
        this.canvas.getContext(`2d`).clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    prepareAxesAndAmountForArrow(values, util) {
        function floatFixed(fValue) {
            return parseFloat(fValue.toFixed(8));
        }

        let text
        let fromX = 5, fromY = 0, toX = 75, toY
        const amount = Math.abs(util.formatFloatToDisplayingAmount(floatFixed(values[0].value - values[1].value)))
        if (values[0].value === values[1].value) {
            toY = 0
            text = 'Не изменилось'
        } else if (values[0].value < values[1].value) {
            fromY = 70
            toY = 0
            text = `+${amount}₽`
        } else {
            fromY = 0
            toY = 70
            text = `-${amount}₽`
        }
        return new ArrowData(fromX, fromY, toX, toY, text)
    }

    drawArrow(values, util) {
        this.clear()
        const arrowData = this.prepareAxesAndAmountForArrow(values, util)
        const ctx = this.canvas.getContext(`2d`)
        ctx.beginPath();
        canvas_arrow(ctx, arrowData.fromX, arrowData.fromY, arrowData.toX, arrowData.toY);
        ctx.font = `18px Tahoma`;
        ctx.fillText(arrowData.amountText, arrowData.toX + 5, (arrowData.fromY + arrowData.toY) / 2);
        ctx.stroke();

        function canvas_arrow(context, fromX, fromY, toX, toY) {
            const headlen = 25;
            const dx = toX - fromX;
            const dy = toY - fromY;
            const angle = Math.atan2(dy, dx);
            context.moveTo(fromX, fromY);
            context.lineTo(toX, toY);
            context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(toX, toY);
            context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        }
    }

}

class ArrowData {
    constructor(fromX, fromY, toX, toY, amountText) {
        this.fromX = fromX
        this.fromY = fromY
        this.toX = toX
        this.toY = toY
        this.amountText = amountText
    }
}

export {ArrowCanvas}