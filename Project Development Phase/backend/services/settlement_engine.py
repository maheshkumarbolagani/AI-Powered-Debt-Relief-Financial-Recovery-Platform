def calculate_settlement_prediction(user, loans):

    total_outstanding = sum(
        loan.outstanding_amount
        for loan in loans
    )

    total_emi = sum(
        loan.emi
        for loan in loans
    )

    # EMI Ratio
    if user.monthly_income > 0:
        emi_ratio = (total_emi / user.monthly_income) * 100
    else:
        emi_ratio = 0

    # Debt-to-Income Ratio
    if user.monthly_income > 0:
        debt_to_income = (
            total_outstanding /
            user.monthly_income
        ) * 100
    else:
        debt_to_income = 0

    settlement_results = []

    for loan in loans:

        # Base settlement percentage
        settlement = 50.0

        # Initial risk score
        risk_score = 0

        # +5% if overdue
        if loan.overdue_months > 0:
            settlement += 5
            risk_score += 20

        # +5% if EMI ratio is high
        if emi_ratio > 50:
            settlement += 5
            risk_score += 15

        # +5% if interest rate is high
        if loan.interest_rate > 12:
            settlement += 5
            risk_score += 10

        # +5% if Debt-to-Income ratio is high
        if debt_to_income > 80:
            settlement += 5
            risk_score += 15

        # Settlement should remain between 40% and 75%
        settlement = max(40, min(75, settlement))

        # Risk Category
        if risk_score >= 40:
            risk_category = "High"
        elif risk_score >= 20:
            risk_category = "Medium"
        else:
            risk_category = "Low"

        settlement_results.append({
            "loan_id": loan.loan_id,
            "lender_name": loan.lender_name,
            "loan_type": loan.loan_type,
            "outstanding_amount": loan.outstanding_amount,
            "interest_rate": loan.interest_rate,
            "emi": loan.emi,
            "overdue_months": loan.overdue_months,
            "suggested_settlement_percentage": settlement,
            "risk_score": risk_score,
            "risk_category": risk_category
        })

    return settlement_results
        