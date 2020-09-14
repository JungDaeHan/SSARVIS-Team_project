import React from "react";

const formatNumber = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
}).format;

function calculateTotal(pieChart) {
  return formatNumber(
    pieChart
      .getAllSeries()[0]
      .getVisiblePoints()
      .reduce((s, p) => s + p.originalValue, 0)
  );
}

function getImagePath(country) {
  return `images/flags/${country.replace(/\s/, "").toLowerCase()}.svg`;
}

export default function TooltipTemplate(pieChart) {
  const attendance = pieChart.getAllSeries()[0].getVisiblePoints()[0].data
    .attendance;
  return (
    <svg>
      <circle
        cx="100"
        cy="100"
        r={pieChart.getInnerRadius() - 6}
        fill="#fff"
      ></circle>
      <text
        textAnchor="middle"
        x="100"
        y="100"
        style={{ fontSize: 20, fill: "#494949" }}
      >
        <tspan x="100">{attendance}</tspan>
        <tspan x="100" dy="20px" style={{ fontWeight: 600 }}>
          {calculateTotal(pieChart)}
        </tspan>
      </text>
    </svg>
  );
}
