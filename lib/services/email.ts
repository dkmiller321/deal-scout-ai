import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface NewDealEmailParams {
  to: string;
  userName: string;
  property: {
    address: string;
    city: string;
    state: string;
    price: number;
    score: number;
    capRate?: number;
    bedrooms: number;
    bathrooms: number;
  };
  criteriaName: string;
}

export async function sendNewDealEmail(params: NewDealEmailParams) {
  const { to, userName, property, criteriaName } = params;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Deal Alert</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏠 New Deal Alert!</h1>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <p style="margin-top: 0;">Hi ${userName},</p>

          <p>Great news! We found a property that matches your <strong>${criteriaName}</strong> criteria:</p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <span style="font-size: 24px; font-weight: bold; color: #333;">${formatPrice(property.price)}</span>
              <span style="background: ${property.score >= 80 ? "#22c55e" : property.score >= 60 ? "#eab308" : "#ef4444"}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                Score: ${property.score}
              </span>
            </div>

            <p style="margin: 0 0 10px 0; font-size: 16px; color: #333;">${property.address}</p>
            <p style="margin: 0 0 15px 0; color: #666;">${property.city}, ${property.state}</p>

            <div style="display: flex; gap: 20px; color: #666; font-size: 14px;">
              <span>🛏️ ${property.bedrooms} beds</span>
              <span>🚿 ${property.bathrooms} baths</span>
              ${property.capRate ? `<span>📈 ${property.capRate.toFixed(1)}% cap rate</span>` : ""}
            </div>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://propflow.ai"}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            View Property Details →
          </a>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            You're receiving this because you have deal alerts enabled for "${criteriaName}".
            <br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #667eea;">Manage your notification preferences</a>
          </p>
        </div>

        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} PropFlow AI. All rights reserved.
        </p>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "PropFlow AI <deals@propflow.ai>",
      to,
      subject: `🔥 Hot Deal: ${property.address} - Score ${property.score}`,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

interface WeeklyDigestParams {
  to: string;
  userName: string;
  stats: {
    newDeals: number;
    hotDeals: number;
    avgScore: number;
  };
  topDeals: Array<{
    address: string;
    city: string;
    price: number;
    score: number;
  }>;
}

export async function sendWeeklyDigest(params: WeeklyDigestParams) {
  const { to, userName, stats, topDeals } = params;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  const dealRows = topDeals
    .map(
      (deal) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef;">
          <strong>${deal.address}</strong><br>
          <span style="color: #666; font-size: 14px;">${deal.city}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right;">
          ${formatPrice(deal.price)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;">
          <span style="background: ${deal.score >= 80 ? "#22c55e" : "#eab308"}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
            ${deal.score}
          </span>
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">📊 Weekly Market Digest</h1>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
          <p>Hi ${userName},</p>
          <p>Here's your weekly investment property summary:</p>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #667eea;">${stats.newDeals}</div>
              <div style="font-size: 12px; color: #666;">New Deals</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${stats.hotDeals}</div>
              <div style="font-size: 12px; color: #666;">Hot Deals</div>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${stats.avgScore}</div>
              <div style="font-size: 12px; color: #666;">Avg Score</div>
            </div>
          </div>

          <h3>Top Deals This Week</h3>
          <table style="width: 100%; background: white; border-radius: 8px; border-collapse: collapse;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left;">Property</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: center;">Score</th>
              </tr>
            </thead>
            <tbody>
              ${dealRows}
            </tbody>
          </table>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 20px;">
            View All Deals →
          </a>
        </div>
      </body>
    </html>
  `;

  return resend.emails.send({
    from: "PropFlow AI <digest@propflow.ai>",
    to,
    subject: `📊 Your Weekly Deal Digest - ${stats.hotDeals} Hot Deals Found`,
    html,
  });
}
