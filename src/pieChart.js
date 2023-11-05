export class PieChart {
    constructor(canvas, legend) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
        this.colors = ["#3ebe2a", "#ff2525", "#5485d0"]
        this.holeSize = 0.5
        this.legend = legend
    }


    draw(data) {
        let val, categ, slice_angle
        let total_value = 0
        let color_index = 0
        for (categ in data) {
            val = data[categ]
            total_value += val
        }

        let start_angle = 0
        for (categ in data) {
            val = data[categ]
            slice_angle = 2 * Math.PI * val / total_value

            drawPieSlice(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                Math.min(this.canvas.width / 2, this.canvas.height / 2),
                start_angle,
                start_angle + slice_angle,
                this.colors[color_index % this.colors.length]
            )

            start_angle += slice_angle
            color_index++
        }

        //hole
        if (this.holeSize) {
            drawPieSlice(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                this.holeSize * Math.min(this.canvas.width / 2, this.canvas.height / 2),
                0,
                2 * Math.PI,
                "#ffffff"
            )
        }

        makeLabels(data, this.canvas, this.ctx, this.holeSize)
        makeLegend(data, this.legend, this.colors)

        function makeLegend(data, legend, colors) {
            color_index = 0;
            let legendHTML = "";
            for (categ in data) {
                if (data[categ] === 0) continue
                legendHTML += "<div><span style='display:inline-block;width:20px;background-color:" + colors[color_index++] + ";'>&nbsp;</span> " + categ + "</div>";
            }
            legend.innerHTML = legendHTML;
        }

        function makeLabels(data, canvas, ctx, holeSize) {
            start_angle = 0
            let allCurrencies = 0
            for (categ in data) {
                val = data[categ]
                allCurrencies += val
                if (val === 0) continue
                slice_angle = 2 * Math.PI * val / total_value
                const pieRadius = Math.min(canvas.width / 2, canvas.height / 2)
                let labelX = canvas.width / 2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2)
                let labelY = canvas.height / 2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2)

                if (holeSize) {
                    const offset = (pieRadius * holeSize) / 2
                    labelX = canvas.width / 2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle / 2)
                    labelY = canvas.height / 2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle / 2)
                }

                const labelText = val
                ctx.fillStyle = "white"
                ctx.font = "18px Tahoma"
                ctx.fillText(labelText, labelX, labelY)
                start_angle += slice_angle
            }

            ctx.fillStyle = "black"
            ctx.font = "22px Tahoma"
            ctx.fillText(allCurrencies.toString(), canvas.width / 2 - 7, canvas.height / 2 + 7)

        }

        function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, startAngle, endAngle)
            ctx.closePath()
            ctx.fill()
        }
    }

}