const allergenAliases = {
	peanut: ["peanut"], peanuts: ["peanut"],
	nut: ["almond", "cashew", "walnut", "hazelnut", "pistachio", "pecan", "nut"], nuts: ["almond", "cashew", "walnut", "hazelnut", "pistachio", "pecan", "nut"],
	dairy: ["milk", "yogurt", "yoghurt", "paneer", "cheese", "butter", "raita", "ghee", "cream"], milk: ["milk", "yogurt", "yoghurt", "paneer", "cheese", "butter", "raita", "ghee", "cream"],
	egg: ["egg", "omelette"], eggs: ["egg", "omelette"],
	soy: ["soy", "soya", "tofu"], soya: ["soy", "soya", "tofu"],
	wheat: ["wheat", "roti", "bread", "paratha", "pasta"], gluten: ["wheat", "roti", "bread", "paratha", "pasta"],
	sesame: ["sesame", "tahini"], fish: ["fish"], shellfish: ["shellfish", "prawn", "shrimp", "crab", "lobster"],
};

export function prepareDietPlan(rawPlan, form) {
	const allergens = form.allergies.toLowerCase().split(/[,;]+/).map((item) => item.trim()).filter(Boolean);
	const avoided = form.avoidFoods.toLowerCase().split(/[,;]+/).map((item) => item.trim()).filter(Boolean);
	const restricted = new Set([...allergens, ...avoided].flatMap((item) => allergenAliases[item] || [item]));
	const days = rawPlan.days.map((day, index) => ({
		day: day.day || index + 1,
		meals: [day.breakfast, day.lunch, day.dinner].map((meal) => {
			if (![...restricted].some((word) => meal.toLowerCase().includes(word))) return meal;
			return "Choose a familiar option confirmed safe for your allergy, with a protein, grain and vegetables; check labels and cross-contact.";
		}),
	}));
	return {
		name: form.name.trim() || "Your plan",
		goal: form.goal,
		preference: form.dietPreference,
		conditions: form.conditions.trim(),
		allergies: form.allergies.trim(),
		avoidFoods: form.avoidFoods.trim(),
		age: form.age,
		days,
		disclaimer: rawPlan.disclaimer,
	};
}

const ascii = (value) => String(value).normalize("NFKD").replace(/[^\x20-\x7E]/g, "");
const escapePdf = (value) => ascii(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

export function downloadDietPlanPdf(plan) {
	const objects = [];
	const addObject = (value) => { objects.push(value); return objects.length; };
	const catalogId = addObject("");
	const pagesId = addObject("");
	const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
	const pageIds = [];
	for (const day of plan.days) {
		const lines = [
			{ text: "HEALTHBRIDGE  |  GROQ-GENERATED MEAL GUIDE", size: 10, y: 748, gray: 0.42 },
			{ text: `7-DAY PLAN FOR ${plan.name}`, size: 20, y: 710, gray: 0.1 },
			{ text: `${plan.goal}  |  ${plan.preference}`, size: 11, y: 686, gray: 0.3 },
			{ text: `DAY ${day.day}`, size: 17, y: 625, gray: 0.1 },
		];
		const mealNames = ["BREAKFAST", "LUNCH", "DINNER"];
		day.meals.forEach((meal, index) => {
			const baseY = 582 - index * 128;
			lines.push({ text: mealNames[index], size: 11, y: baseY, gray: 0.48 });
			const wrapped = String(meal).match(/.{1,76}(?:\s|$)/g) || [meal];
			wrapped.slice(0, 4).forEach((line, lineIndex) => lines.push({ text: line.trim(), size: 12, y: baseY - 23 - lineIndex * 17, gray: 0.16 }));
		});
		let notesY = 163;
		for (const note of [
			plan.age ? `Age: ${plan.age}` : "",
			plan.conditions ? `Health notes provided: ${plan.conditions}` : "",
			plan.allergies ? `Allergies / intolerances noted: ${plan.allergies}` : "",
			plan.avoidFoods ? `Foods to avoid: ${plan.avoidFoods}` : "",
		].filter(Boolean)) {
			const wrapped = note.match(/.{1,88}(?:\s|$)/g) || [note];
			wrapped.slice(0, 2).forEach((line) => { lines.push({ text: line.trim(), size: 9, y: notesY, gray: 0.35 }); notesY -= 13; });
		}
		const footerY = Math.min(93, notesY - 13);
		lines.push({ text: "General wellness guide only. Not medical nutrition therapy or a substitute for clinician advice.", size: 8, y: footerY, gray: 0.42 });
		lines.push({ text: "Check food labels and cross-contact risks. Consult a clinician for allergies or health conditions.", size: 8, y: footerY - 14, gray: 0.42 });
		const stream = lines.map((line) => `BT /F1 ${line.size} Tf ${line.gray} g 54 ${line.y} Td (${escapePdf(line.text)}) Tj ET`).join("\n");
		const streamId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
		pageIds.push(addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`));
	}
	objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
	objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
	let pdf = "%PDF-1.4\n";
	const offsets = [0];
	objects.forEach((object, index) => {
		offsets.push(pdf.length);
		pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
	});
	const xrefOffset = pdf.length;
	pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
	pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
	const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = `healthbridge-diet-plan-${new Date().toISOString().slice(0, 10)}.pdf`;
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
