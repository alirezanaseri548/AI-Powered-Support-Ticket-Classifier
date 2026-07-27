from fastapi import FastAPI

app = FastAPI(title='AI Support Ticket ML Service')

@app.get('/health')
def health_check():
    return {'status': 'ok'}
