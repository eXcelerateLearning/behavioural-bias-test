window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  (async function() {
    // Dynamically load pdf-lib from local folder
    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "story_content/libs/pdf-lib.min.js"; // adjust if needed
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    const { PDFDocument } = PDFLib;

    // Load the PDF template
    const existingPdfBytes = await fetch("story_content/assets/ReflectionsTemplate.pdf")
        .then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // List of Storyline variables to map to PDF fields
    const variables = [
        "AnchoringReflection",
        "ApathyReflection",
        "ConfirmationReflection",
        "InertiaReflection",
        "LossAversionReflection",
        "OptimismReflection",
        "PresentReflection",
        "SludgeReflection",
        "Q3Reflection",
        "Q4Reflection"
    ];

    // Fill PDF fields with Storyline variable values
    variables.forEach(field => {
        const pdfField = form.getTextField(field);
        const value = GetPlayer().GetVar(field) || "[No response]";
        pdfField.setText(value);
    });

    // Save updated PDF and trigger download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Reflections.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})();

}

window.Script2 = function()
{
  var scorm = pipwerks.SCORM;
scorm.version = "2004";
scorm.init();

function sendInteraction(id, question, answer) {
    var interactionID = "interaction_" + id + "_" + new Date().getTime();
    scorm.set("cmi.interactions." + interactionID + ".id", interactionID);
    scorm.set("cmi.interactions." + interactionID + ".type", "other");
    scorm.set("cmi.interactions." + interactionID + ".objectives.0.id", question);
    scorm.set("cmi.interactions." + interactionID + ".learner_response", answer);
    scorm.set("cmi.interactions." + interactionID + ".result", "neutral");
}

var q4Variables = ["Q3Reflection","Q4Reflection"];

for(var i=0; i<q4Variables.length; i++){
    var answer = GetPlayer().GetVar(q4Variables[i]);
    sendInteraction(i+100, q4Variables[i], answer || "");
}

scorm.save();
scorm.quit();

}

window.Script3 = function()
{
  // Initialize SCORM 2004
var scorm = pipwerks.SCORM;
scorm.version = "2004";
scorm.init();

// Helper to send interaction
function sendInteraction(id, question, answer) {
    var interactionID = "interaction_" + id + "_" + new Date().getTime();
    scorm.set("cmi.interactions." + interactionID + ".id", interactionID);
    scorm.set("cmi.interactions." + interactionID + ".type", "other");
    scorm.set("cmi.interactions." + interactionID + ".objectives.0.id", question);
    scorm.set("cmi.interactions." + interactionID + ".learner_response", answer);
    scorm.set("cmi.interactions." + interactionID + ".result", "neutral");
}

// Variables for Q1 checkboxes and Q2 reflections
var checkboxes = ["AnchoringChecked","ApathyChecked","ConfirmationChecked","InertiaChecked","LossAversionChecked","OptimismChecked","PresentChecked","SludgeChecked"];
var reflections = ["AnchoringReflection","ApathyReflection","ConfirmationReflection","InertiaReflection","LossAversionReflection","OptimismReflection","PresentReflection","SludgeReflection"];

// Loop through checkboxes & reflections
for(var i=0; i<checkboxes.length; i++){
    var checked = GetPlayer().GetVar(checkboxes[i]); // true/false
    var reflection = GetPlayer().GetVar(reflections[i]);
    if(checked){ // Only push if the bias was selected
        sendInteraction(i, checkboxes[i], reflection || ""); 
    }
}

// Commit changes
scorm.save();
scorm.quit();

}

};
