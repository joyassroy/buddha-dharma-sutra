import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Track an event (Public, called by the tracker)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, path, details } = body;

    // We don't need to block if this fails, so we can just fire and forget or await it.
    await connectToDatabase();
    await AnalyticsEvent.create({
      eventType: eventType || "PAGE_VIEW",
      path: path || "/",
      details: details || "",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    // Fail silently for analytics so it doesn't break the user experience
    console.error("Analytics Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Get analytics data (Protected, Admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate Views over the last 7 days
    const dailyViews = await AnalyticsEvent.aggregate([
      { 
        $match: { 
          eventType: "PAGE_VIEW",
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for Recharts
    const chartData = dailyViews.map(day => ({
      date: day._id.split('-').slice(1).join('/'), // e.g. "06/25"
      views: day.views
    }));

    // Top Pages
    const topPages = await AnalyticsEvent.aggregate([
      { $match: { eventType: "PAGE_VIEW" } },
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]);

    // Top Searches
    const topSearches = await AnalyticsEvent.aggregate([
      { $match: { eventType: "SEARCH" } },
      { $group: { _id: "$details", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({ 
      success: true, 
      data: {
        chartData,
        topPages: topPages.map(p => ({ path: p._id, views: p.views })),
        topSearches: topSearches.map(s => ({ query: s._id, count: s.count }))
      } 
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch analytics", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
