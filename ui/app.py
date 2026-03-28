from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def start_up():
    return '''
    <h2><a href="/language=english">For English click here</a></h2>
    <h2><a href="/language=spanish">Para español elegir aquí</a></h2>
    '''

@app.route('/language=<language>')
def language(language):
    return render_template('Website_for_Translate.html')
    
    
if __name__ == "__main__":
    app.run(debug=True)

