import React, { useState, useEffect, forwardRef, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun as SunIcon, // Renamed to avoid conflict
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Wind,
  CloudDrizzle,
  ThermometerSun,
  ThermometerSnowflake,
  Sunrise,
  Sunset,
  Gauge,
  Droplet,
  Search,
  AlertTriangle,
  CalendarDays,
  MapPin,
  Loader2, // Added for loading state
  Monitor, // Added for system theme icon - Not used, but available
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Chart.js Registration ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Tailwind/Shadcn Utility ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Theme Hook ---
const useTheme = () => {
  // Function to get initial theme: Checks localStorage first, then system preference
  const getInitialTheme = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme; // Use stored theme if valid
      }
      // If no valid theme in storage, check system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // Default for SSR or non-browser environments
  }, []);

  const [theme, setTheme] = useState(getInitialTheme);

  // Effect to apply theme class to HTML element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle theme between light and dark
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
};

// --- Shadcn/ui Inspired Components (Internal) ---

const Card = forwardRef(({ className, ...props }, ref) => (
  <motion.div // Added motion here for animation
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:shadow-lg dark:hover:shadow-blue-500/10",
      className
    )}
    variants={itemVariants} // Apply item variants
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} // Adjusted padding
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base sm:text-lg font-semibold leading-none tracking-tight", // Responsive font size
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xs sm:text-sm text-gray-500 dark:text-gray-400",
      className
    )} // Responsive font size
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} /> // Adjusted padding
));
CardContent.displayName = "CardContent";

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Button = forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-blue-600 text-white hover:bg-blue-600/90 dark:bg-blue-500 dark:text-gray-900 dark:hover:bg-blue-500/90",
      destructive:
        "bg-red-600 text-white hover:bg-red-600/90 dark:bg-red-700 dark:text-gray-50 dark:hover:bg-red-700/90",
      outline:
        "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      ghost:
        "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50", // Added ghost variant
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Alert = forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full rounded-lg border p-4",
      variant === "destructive"
        ? "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 dark:text-red-400"
        : "border-gray-200 text-gray-900 dark:border-gray-800 dark:text-gray-50",
      className
    )}
    role="alert"
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  );
};

// --- Theme Toggle Button ---
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

// --- Weather-Specific Components (Internal) ---

/**
 * Renders a line chart for the 7-day forecast.
 */
const WeatherChart = ({ forecastData = [] }) => {
  const { theme } = useTheme(); // Use theme for chart colors

  const textColor = theme === "dark" ? "#9ca3af" : "#6b7280"; // gray-400 / gray-500
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"; // gray-700 / gray-200
  const tooltipBg = theme === "dark" ? "#1f2937" : "#111827"; // gray-800 / gray-900
  const tooltipTitle = theme === "dark" ? "#f9fafb" : "#f3f4f6"; // gray-50 / gray-100
  const tooltipBody = theme === "dark" ? "#d1d5db" : "#d1d5db"; // gray-300 / gray-300

  const labels = forecastData.slice(0, 7).map((day) => {
    const date = new Date(day.datetime + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
    });
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Max Temp (°C)",
        data: forecastData.slice(0, 7).map((day) => day.tempmax),
        borderColor: "#ef4444", // red-500
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: theme === "dark" ? "#1f2937" : "#fff", // Match point border to bg
        pointHoverBackgroundColor: theme === "dark" ? "#1f2937" : "#fff",
        pointHoverBorderColor: "#ef4444",
      },
      {
        label: "Min Temp (°C)",
        data: forecastData.slice(0, 7).map((day) => day.tempmin),
        borderColor: "#3b82f6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: theme === "dark" ? "#1f2937" : "#fff",
        pointHoverBackgroundColor: theme === "dark" ? "#1f2937" : "#fff",
        pointHoverBorderColor: "#3b82f6",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          color: textColor,
          font: { family: "Inter, sans-serif" },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        borderColor: gridColor,
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: gridColor, drawBorder: false },
        ticks: { color: textColor },
      },
      x: {
        grid: { display: false },
        ticks: { color: textColor },
      },
    },
  };

  return <Line options={options} data={data} />;
};

/**
 * Renders a specific icon based on weather conditions with appropriate colors.
 */
const WeatherIcon = ({ condition, isNight, className, ...props }) => {
  const lowerCaseCondition = condition?.toLowerCase() || "unknown";
  let Icon = Cloud;
  let iconColor = "text-gray-400 dark:text-gray-500"; // default

  if (lowerCaseCondition.includes("clear")) {
    Icon = isNight ? Moon : SunIcon;
    iconColor = isNight
      ? "text-slate-400 dark:text-slate-300"
      : "text-yellow-500";
  } else if (lowerCaseCondition.includes("thunderstorm")) {
    Icon = CloudLightning;
    iconColor = "text-amber-500 dark:text-amber-400";
  } else if (
    lowerCaseCondition.includes("rain") ||
    lowerCaseCondition.includes("shower")
  ) {
    Icon = CloudRain;
    iconColor = "text-blue-500 dark:text-blue-400";
  } else if (lowerCaseCondition.includes("drizzle")) {
    Icon = CloudDrizzle;
    iconColor = "text-sky-500 dark:text-sky-400";
  } else if (lowerCaseCondition.includes("snow")) {
    Icon = CloudSnow;
    iconColor = "text-sky-300 dark:text-sky-200";
  } else if (lowerCaseCondition.includes("wind")) {
    Icon = Wind;
    iconColor = "text-gray-500 dark:text-gray-400";
  } else if (
    lowerCaseCondition.includes("cloudy") ||
    lowerCaseCondition.includes("overcast")
  ) {
    Icon = Cloud;
    iconColor = "text-gray-400 dark:text-gray-500";
  }

  return <Icon className={cn(iconColor, className)} {...props} />;
};

// --- API Service Functions (Internal) ---
const BASE_URL = "https://weather-dashboard-api-zymw.onrender.com/api/weather";
const API_DATE_FORMAT = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

/**
 * Fetches current weather and 15-day forecast.
 */
const getCurrentWeather = async (city) => {
  const response = await axios.get(`${BASE_URL}/${encodeURIComponent(city)}`);
  return response.data;
};

/**
 * Fetches historical weather for today's date.
 */
const getHistoricalWeather = async (city) => {
  const response = await axios.get(`${BASE_URL}/history`, {
    params: { city, date: API_DATE_FORMAT },
  });
  return response.data;
};

/**
 * Fetches any active weather alerts.
 */
const getWeatherAlerts = async (city) => {
  const response = await axios.get(`${BASE_URL}/alerts`, {
    params: { city },
  });
  return response.data;
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Faster stagger
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 }, // Smaller y offset
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12, // Tighter spring
      stiffness: 100,
    },
  },
};

// --- Main Application Component ---
const DEFAULT_CITY = "Dehradun";

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      setWeather(null); // Clear data immediately for loading state
      setHistory(null);
      setAlerts([]);

      const results = await Promise.allSettled([
        getCurrentWeather(cityName),
        getHistoricalWeather(cityName),
        getWeatherAlerts(cityName),
      ]);

      let fetchError = null;

      // Current weather (critical)
      if (results[0].status === "fulfilled") {
        setWeather(results[0].value);
        setCity(results[0].value.address);
      } else {
        fetchError =
          results[0].reason?.response?.data?.message ||
          results[0].reason?.message ||
          "Failed to fetch current weather.";
      }

      // Historical weather (non-critical)
      if (results[1].status === "fulfilled") {
        setHistory(results[1].value);
      } else {
        console.warn("Could not fetch historical data:", results[1].reason);
      }

      // Alerts (non-critical)
      if (results[2].status === "fulfilled") {
        setAlerts(results[2].value?.alerts || []);
      } else {
        console.warn("Could not fetch alerts:", results[2].reason);
      }

      if (fetchError) {
        throw new Error(fetchError);
      }
    } catch (e) {
      if (
        e.message.includes("Network Error") ||
        e.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        setError(
          "Network Error: Could not connect to the backend server. Please make sure your server is running on http://localhost:8080 and configured for CORS."
        );
      } else {
        setError(e.message || "An unknown error occurred.");
      }
      setWeather(null);
      setHistory(null);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(DEFAULT_CITY);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchData(input.trim());
      setInput("");
    }
  };

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentConditions = weather?.currentConditions;
  const isNight =
    currentConditions &&
    (currentConditions?.datetimeEpoch < currentConditions?.sunriseEpoch ||
      currentConditions?.datetimeEpoch > currentConditions?.sunsetEpoch);

  const renderContent = () => {
    if (loading) {
      return <DashboardLoadingSkeleton />;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="lg:col-span-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!weather) {
      return (
        <Alert variant="destructive" className="lg:col-span-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            Weather data could not be loaded. Please try searching again.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={city}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" // Adjusted grid and gap for responsiveness
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* === ALERTS (If any) === */}
          {alerts && alerts.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 lg:col-span-4"
            >
              <Card className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                    <AlertTriangle className="w-5 h-5" /> Active Weather Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert, idx) => (
                    <Alert
                      key={idx}
                      variant="destructive"
                      className="bg-white dark:bg-gray-900 border-yellow-300 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200"
                    >
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <AlertTitle className="text-yellow-800 dark:text-yellow-200">
                        {alert.event}
                      </AlertTitle>
                      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                        {alert.description}
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* === CURRENT WEATHER (Main) === */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-3"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" /> Current Weather
                  in {city}
                </CardTitle>
                <CardDescription>{today}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col xl:flex-row items-center xl:items-start gap-4 xl:gap-6">
                  {/* Left Side: Icon & Temp */}
                  <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <WeatherIcon
                      condition={currentConditions?.conditions}
                      isNight={isNight}
                      className="w-20 h-20 sm:w-24 sm:h-24" // Responsive icon size
                    />
                    <div className="text-center md:text-left">
                      <div className="text-5xl sm:text-6xl font-bold">
                        {Math.round(currentConditions?.temp ?? 0)}°
                      </div>
                      <div className="text-sm sm:text-lg text-gray-500 capitalize mt-1">
                        {currentConditions?.conditions}
                      </div>
                    </div>
                  </div>
                  {/* Right Side: Details */}
                  <div className="flex-1 space-y-3 w-full border-t pt-4 xl:border-t-0 xl:pt-0 xl:border-l xl:pl-6 dark:border-gray-700 max-w-md xl:max-w-none mx-auto xl:mx-0">
                    <div className="text-base sm:text-lg">
                      Feels like{" "}
                      <span className="font-semibold">
                        {Math.round(currentConditions?.feelslike ?? 0)}°
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <Droplet className="w-4 h-4" />
                        Humidity: {currentConditions?.humidity ?? "-"}%
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wind className="w-4 h-4" />
                        Wind: {currentConditions?.windspeed ?? "-"} km/h
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sunrise className="w-4 h-4" />
                        Sunrise: {currentConditions?.sunrise ?? "-"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sunset className="w-4 h-4" />
                        Sunset: {currentConditions?.sunset ?? "-"}
                      </span>
                      <span className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                        <Gauge className="w-4 h-4" />
                        Pressure: {currentConditions?.pressure ?? "-"} mb
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* === SIDEBAR (History & 7-Day) === */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 space-y-4 md:space-y-6" // Combined history & forecast for mobile/tablet
          >
            {/* Historical Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" /> Today's Historical Avg.
                </CardTitle>
                <CardDescription>({API_DATE_FORMAT})</CardDescription>
              </CardHeader>
              <CardContent>
                {history && history.days && history.days.length > 0 ? (
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Avg. Max
                      </span>
                      <span className="font-semibold flex items-center gap-1">
                        <ThermometerSun className="w-4 h-4 text-red-500" />
                        {Math.round(history.days[0].tempmax)}°
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Avg. Min
                      </span>
                      <span className="font-semibold flex items-center gap-1">
                        <ThermometerSnowflake className="w-4 h-4 text-blue-500" />
                        {Math.round(history.days[0].tempmin)}°
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        Avg. Precip
                      </span>
                      <span className="font-semibold flex items-center gap-1">
                        <CloudDrizzle className="w-4 h-4 text-gray-400" />
                        {history.days[0].precip.toFixed(1)} mm
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Historical data not available.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Forecast Card */}
            <Card>
              <CardHeader>
                <CardTitle>7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {weather?.days?.slice(1, 8).map((day) => (
                  <div
                    key={day.datetimeEpoch}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-gray-600 dark:text-gray-300 w-12">
                      {new Date(day.datetimeEpoch * 1000).toLocaleDateString(
                        "en-US",
                        { weekday: "short" }
                      )}
                    </span>
                    <WeatherIcon
                      condition={day.conditions}
                      isNight={false}
                      className="w-5 h-5 mx-2"
                    />
                    <span className="text-gray-500 dark:text-gray-400 w-20 text-right">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {Math.round(day.tempmax)}°
                      </span>{" "}
                      / {Math.round(day.tempmin)}°
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* === FORECAST CHART === */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Temperature Forecast</CardTitle>
              </CardHeader>
              <CardContent className="h-64 sm:h-80">
                <WeatherChart forecastData={weather?.days} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const DashboardLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="md:col-span-2 lg:col-span-1 space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </CardContent>
        </Card>
      </div>
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="h-64 sm:h-80">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300 w-full overflow-y-scroll no-scrollbar h-64">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Weather Dashboard
          </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <form
              onSubmit={handleSearch}
              className="flex flex-grow sm:flex-grow-0"
            >
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search city..." // Shorter placeholder
                className="rounded-r-none focus-visible:ring-offset-0 flex-grow min-w-0" // Allow input to shrink
              />
              <Button
                type="submit"
                variant="default"
                size="icon"
                className="rounded-l-none flex-shrink-0" // Prevent button from shrinking
                aria-label="Search"
                disabled={loading} // Disable search while loading
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
            <ThemeToggle />
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        {renderContent()}

        {/* --- FOOTER --- */}
        <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Weather Dashboard. All rights
            reserved.
          </p>
          <p className="mt-1">
            Weather data provided by Visual Crossing Weather API.
          </p>
          <p className="mt-1"> Made with ❤️ by Rishi Yadav.</p>
        </footer>
      </div>
    </div>
  );
}
