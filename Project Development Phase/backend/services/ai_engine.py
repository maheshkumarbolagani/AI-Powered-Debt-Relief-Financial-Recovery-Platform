import os
import logging
from dotenv import load_dotenv
from google import genai

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

logger.info(f"API Key configured: {'Present' if GOOGLE_API_KEY else 'Missing'}")


def _call_gemini(prompt: str):

    # No API key available
    if not GOOGLE_API_KEY:
        logger.warning("No Gemini API Key found. Using fallback engine.")
        return None

    try:
        client = genai.Client(api_key=GOOGLE_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        logger.exception("Gemini API Error occurred during content generation")
        logger.info("Switching to fallback engine...")
        return None


def generate_negotiation_strategy(user, loan):

    prompt = f"""
Generate a professional debt settlement negotiation strategy.

Borrower Name: {user.name}
Monthly Income: {user.monthly_income}
Monthly Expenses: {user.monthly_expenses}

Loan Details:
Lender: {loan.lender_name}
Loan Type: {loan.loan_type}
Outstanding Amount: {loan.outstanding_amount}
Interest Rate: {loan.interest_rate}
EMI: {loan.emi}
Overdue Months: {loan.overdue_months}

Generate:
1. Negotiation strategy
2. Settlement percentage suggestion
3. Professional negotiation letter
"""

    ai_response = _call_gemini(prompt)

    if ai_response:

        return {
            "source": "Gemini AI",
            "response": ai_response
        }

    return {
    "source": "Fallback Engine",
    "status": "Gemini unavailable",
    "response": f"""
Negotiation Strategy

• Request partial settlement.
• Highlight financial hardship.
• Request reduction in interest.
• Propose flexible EMI plan.

Suggested Settlement:
Approximately 60% of outstanding amount.

Professional Letter

Dear {loan.lender_name},

I am currently facing financial difficulties and respectfully request consideration for a mutually beneficial settlement of my outstanding loan.

Thank you.

Sincerely,
{user.name}
"""
}